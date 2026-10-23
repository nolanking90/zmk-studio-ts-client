import { Request, Layer } from '../src/keymap';

describe('keymap sensor bindings', () => {
  it('round-trips a set_layer_sensor_binding request', () => {
    const req: Request = {
      ...Request.fromPartial({}),
      setLayerSensorBinding: {
        layerId: 2,
        sensorIndex: 1,
        binding: { behaviorId: 20, param1: 0x0c00e9, param2: 0x0c00ea },
      },
    };

    const decoded = Request.decode(Request.encode(req).finish());

    expect(decoded.setLayerSensorBinding).toEqual(req.setLayerSensorBinding);
  });

  it('decodes layers with and without sensor bindings', () => {
    const withSensors = Layer.fromPartial({
      id: 0,
      name: 'Base',
      bindings: [{ behaviorId: 8, param1: 4, param2: 0 }],
      sensorBindings: [{ behaviorId: 20, param1: 1, param2: 2 }],
    });

    expect(Layer.decode(Layer.encode(withSensors).finish()).sensorBindings).toEqual(
      withSensors.sensorBindings
    );

    // A layer from older firmware has no field 4 at all.
    const legacy = Layer.fromPartial({ id: 1, name: 'Old', bindings: [] });
    expect(Layer.decode(Layer.encode(legacy).finish()).sensorBindings).toEqual([]);
  });
});
