import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { z } from 'zod';
import { TransactionSchema } from '../../shared/transaction.schema';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  getAll() {
    return this.transactionService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.transactionService.getOne(id);
  }

  @Post()
  create(@Body() body: any) {
    const parsed = TransactionSchema.safeParse(body);
    if (!parsed.success) {
      throw new Error('Invalid transaction: ' + JSON.stringify(parsed.error.issues));
    }
    return this.transactionService.create(parsed.data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const parsed = TransactionSchema.safeParse(body);
    if (!parsed.success) {
      throw new Error('Invalid transaction: ' + JSON.stringify(parsed.error.issues));
    }
    return this.transactionService.update(id, parsed.data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.transactionService.delete(id);
  }
}
