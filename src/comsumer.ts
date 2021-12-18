import { Inject, Named, Qualifier, Scope, Singleton } from "./annotations";
import { ColorComponent, Component, VehicleComponent } from "./component";

export class Consumer {
  protected component: Component;
  getComponent(): Component {
    return this.component;
  }
}

export class ComponentConsumer extends Consumer {
  @Inject() component: Component;

  constructor(component: Component) {
    super();
    this.component = component;
  }

  getComponent(): Component {
    return this.component;
  }
}

export class OtherComponentConsumer extends Consumer {
  getComponent(): Component {
    return this.component;
  }
}

export class ComponentConsumerWithTwoConstructors extends Consumer {
  @Inject() component: Component;

  constructor();
  constructor(component?: Component) {
    super();
    this.component = component;
  }

  getComponent(): Component {
    return this.component;
  }
}

export class ComponentConsumerWithNamedParam extends Consumer {
  @Named('blue') public blueComponent: ColorComponent;
  @Named('red') public redComponent: ColorComponent;

  constructor(redComponent: ColorComponent, blueComponent: ColorComponent) {
    super();
    this.blueComponent = blueComponent;
    this.redComponent = redComponent;
  }

  getBlueComponent(): ColorComponent {
    return this.blueComponent;
  }

  getRedComponent(): ColorComponent {
    return this.redComponent;
  }
}

export class ComponentConsumerWithQualifierParam extends Consumer {
  @Qualifier({ value: 'bus' }) busComponent: VehicleComponent;
  @Qualifier({ value: 'car' }) carComponent: VehicleComponent;

  constructor(busComponent: VehicleComponent, carComponent: VehicleComponent) {
    super();
    this.busComponent = busComponent;
    this.carComponent = carComponent;
  }

  getBigVehicleComponent(): VehicleComponent {
    return this.busComponent;
  }

  getSmallVehicleComponent(): VehicleComponent {
    return this.carComponent;
  }
}

export class SingletonComponentConsumer extends Consumer {
  @Singleton() component: Component;

  getComponent(): Component {
    return this.component;
  }
}

export class ScopeComponentConsumer extends Consumer {
  @Scope('scopeDemo') component: Component;

  getComponent(): Component {
    return this.component;
  }
}
