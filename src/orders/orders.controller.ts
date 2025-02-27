import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
  Logger,
} from '@nestjs/common';

import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    try {
      return this.client.send('createOrder', createOrderDto);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get()
  async findAll(
    @Query() orderPaginationDto: OrderPaginationDto,
  ): Promise<OrderPaginationDto> {
    try {
      const orders: OrderPaginationDto = await firstValueFrom(
        this.client.send('findAllOrders', orderPaginationDto),
      );
      return orders;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(this.client.send('findOneOrder', id));

      return order;
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Get('status/:status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      return this.client.send('findAllOrders', {
        ...paginationDto,
        status: statusDto.status,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  @Patch(':id/status')
  updateOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      console.log(id);
      return this.client.send('updateOrderStatus', {
        id,
        status: statusDto.status,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }
}
