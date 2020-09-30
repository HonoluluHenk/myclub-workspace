import mongoose, {Document} from 'mongoose';
import {schema} from '../mongoose.helper';

export interface RegionProps {
  name: string;
}

export interface Region extends RegionProps, Document {
}

export const RegionSchema = schema<RegionProps>({
  name: {type: String, required: true, unique: true},
});

export const RegionModel = mongoose.model<Region>('Region', RegionSchema);
