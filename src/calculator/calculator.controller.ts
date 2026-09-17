import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CalculatorService } from './calculator.service';
import { CalculateOrderDto } from './dto/calculate-order.dto';
import { CalculationResult } from './types/menu.type';

@Controller('calculator')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  calculate(@Body() order: CalculateOrderDto): CalculationResult {
    return this.calculatorService.calculate(order);
  }
}
