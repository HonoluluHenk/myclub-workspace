import * as mongoose from 'mongoose';
import {Document} from 'mongoose';
import {schema} from '../mongoose.helper';
import {RegionProps, RegionSchema} from './region.model';

export interface FederationProps {
  name: string;
  regions: RegionProps[],
}

interface Federation extends FederationProps, Document {
}

const FederationSchema = schema<FederationProps>({
  name: {type: String, required: true, unique: true},
  regions: [RegionSchema],
});

export const FederationModel = mongoose.model<Federation>('Federation', FederationSchema);
