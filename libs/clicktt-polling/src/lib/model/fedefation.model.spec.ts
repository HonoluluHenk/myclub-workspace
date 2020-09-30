import mongoose from 'mongoose';
import {FederationModel, FederationProps} from './federation.model';
import {RegionModel, RegionProps} from './region.model';

describe('Federation', () => {
  beforeAll(async () => {
    // @ts-ignore
    const uri = global.__MONGO_URI__;
    await mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}, err => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  });

  it('persists', async () => {
    const stt = new FederationModel(<FederationProps>{
      name: 'STT',
    });
    stt.regions.push(new RegionModel(<RegionProps>{
      name: 'AGTT',
    }));
    stt.regions.push(new RegionModel(<RegionProps>{
      name: 'MTTV',
    }));

    const saved = await stt.save();

    expect(saved._id)
      .toBeDefined();

    expect(saved.name)
      .toEqual('STT');

    expect(saved.regions[0])
      .toMatchObject({name: 'AGTT', _id: expect.any(mongoose.Types.ObjectId)});
    expect(saved.regions[1])
      .toMatchObject({name: 'MTTV', _id: expect.any(mongoose.Types.ObjectId)});
  });
});
