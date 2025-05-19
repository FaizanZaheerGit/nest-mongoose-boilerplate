import { ArgumentMetadata, BadRequestException, HttpStatus, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export class ValidationPipe implements PipeTransform {
  async transform(value: any, metaData: ArgumentMetadata): Promise<any> {
    const { metatype } = metaData;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const obj: any = plainToInstance(metatype, value, { enableImplicitConversion: true });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const errors = await validate(obj, {
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      const formattedErrors = this.formatErrors(errors);
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        data: {},
        message: `Validation Failed`,
        error: formattedErrors,
        success: false,
      });
    }
    return obj;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Number, Boolean, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]) {
    return errors.flatMap((err) => {
      if (err.constraints) {
        return Object.values(err.constraints);
      }
      if (err.children?.length) {
        this.formatErrors(err.children);
      }
      return [];
    });
  }
}
