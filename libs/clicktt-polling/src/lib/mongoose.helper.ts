import {Schema, SchemaOptions, SchemaType, SchemaTypeOpts} from 'mongoose';
import {NoInfer} from '../../../myclub-shared/src/lib/util';

type Definition<T extends object = never> = NoInfer<T, {
  [path in keyof NoInfer<T>]: SchemaTypeOpts<any> | Schema | SchemaType
}>;

export function schema<T extends object = never>(
  definition: Definition<T>,
  options?: SchemaOptions,
): Schema {
  return new Schema(definition, options);
}
