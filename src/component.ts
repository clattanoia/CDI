import { Named, Qualifier } from "./annotations";

export class Component {}

export class CustomComponent implements Component {}

export class ComponentWithDefaultConstructor extends Component {}

export class ColorComponent {}

@Named('blue')
export class BlueComponent extends ColorComponent {
  getColor(): string {
    return 'blue';
  }
}

@Named('red')
export class RedComponent extends ColorComponent {
  getColor(): string {
    return 'red';
  }
}

export class VehicleComponent {}

@Qualifier({
  value: 'bus',
})
export class BusVehicleComponent extends VehicleComponent {
  getSize(): string {
    return 'bus';
  }
}

@Qualifier({ value: 'car' })
export class CarVehicleComponent extends VehicleComponent {
  getSize(): string {
    return 'car';
  }
}
