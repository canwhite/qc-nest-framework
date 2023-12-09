import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ExamplePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('value', value);
    return value + '  world';
  }
}
