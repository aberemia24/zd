import { Body, Controller, Delete, Get, Param, Post, Put, HttpException, HttpStatus, NotFoundException, BadRequestException, HttpCode, Query } from '@nestjs/common';
import { TransactionSchema, CreateTransactionSchema } from '@shared-constants/transaction.schema';
import { TransactionService } from './transaction.service';
import { z } from 'zod';


@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  getAll(
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('sort') sort?: string
  ) {
    return this.transactionService.getAll({ type, category, dateFrom, dateTo, limit, offset, sort });
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    const transaction = this.transactionService.getOne(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  @Post()
  async create(@Body() body: any) {
    const parsed = CreateTransactionSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        error: 'VALIDATION_ERROR',
        messageKey: 'transactions.invalid',
        details: parsed.error.issues,
      });
    }
    const created = await this.transactionService.create(parsed.data);
    return {
      ...created,
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const parsed = TransactionSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        error: 'VALIDATION_ERROR',
        messageKey: 'transactions.invalid',
        details: parsed.error.issues,
      });
    }
    const updated = await this.transactionService.update(id, parsed.data);
    if (!updated) {
      throw new NotFoundException('Transaction not found');
    }
    return updated;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    const deleted = await this.transactionService.delete(id);
    if (!deleted) {
      throw new NotFoundException('Transaction not found');
    }
    // 204 No Content: nu returnăm body
    return;
  }
}
