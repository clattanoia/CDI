import { Injector } from '../injector';
import { Qualifier, Inject, Named, Singleton, Scope } from '../annotations';
import { BlueComponent, BusVehicleComponent, CarVehicleComponent, ColorComponent, Component, ComponentWithDefaultConstructor, CustomComponent, RedComponent, VehicleComponent } from '../component';
import { ComponentConsumer, ComponentConsumerWithNamedParam, ComponentConsumerWithQualifierParam, ComponentConsumerWithTwoConstructors, Consumer, OtherComponentConsumer, ScopeComponentConsumer, SingletonComponentConsumer } from '../comsumer';

describe('dependency injection', () => {
  it('should bind class to special instance', function () {
    const injector = new Injector();
    const component = new Component();

    injector.bind(Component, component);

    expect(component).toBe(injector.get(Component));
  });

  it('should inject dependencies via constructor parameters', function () {
    const injector = new Injector();
    const component = new Component();

    injector.bind(Component, component);
    injector.bind(Consumer, ComponentConsumer);

    expect(component).toBe(injector.get(Consumer).getComponent());
  });

  it('should bind type to specific class with default constructor', function () {
    const injector = new Injector();

    injector.bind(
      ComponentWithDefaultConstructor,
      ComponentWithDefaultConstructor
    );

    expect(injector.get(ComponentWithDefaultConstructor)).not.toBeNull();
  });

  it('should inject to annotated constructor', function () {
    const injector = new Injector();
    const component = new Component();

    injector.bind(Component, component);
    injector.bind(Consumer, ComponentConsumerWithTwoConstructors);

    expect(component).toBe(injector.get(Consumer).getComponent());
  });

  it('should inject to component instance everytime', function () {
    const injector = new Injector();

    injector.bind(Component, CustomComponent);
    injector.bind(ComponentConsumer, ComponentConsumer);
    injector.bind(OtherComponentConsumer, OtherComponentConsumer);

    expect(injector.get(ComponentConsumer)).not.toBe(
      injector.get(ComponentConsumer)
    );
  });

  it('should inject to component with name', function () {
    const injector = new Injector();
    const blueComponent = new BlueComponent();
    const redComponent = new RedComponent();

    injector.bind(ColorComponent, blueComponent);
    injector.bind(ColorComponent, redComponent);
    injector.bind(Consumer, ComponentConsumerWithNamedParam);

    expect(injector.get(Consumer).getBlueComponent().getColor()).toBe('blue');
    expect(injector.get(Consumer).getRedComponent().getColor()).toBe('red');
  });

  it('should inject to component with qualifier', function () {
    const injector = new Injector();

    injector.bind(VehicleComponent, BusVehicleComponent);
    injector.bind(VehicleComponent, CarVehicleComponent);
    injector.bind(Consumer, ComponentConsumerWithQualifierParam);

    expect(injector.get(Consumer).getBigVehicleComponent().getSize()).toBe(
      'bus'
    );
    expect(injector.get(Consumer).getSmallVehicleComponent().getSize()).toBe(
      'car'
    );
  });

  it('should inject to singleton component', function () {
    const injector = new Injector();

    injector.bind(Component, CustomComponent);
    injector.bind(SingletonComponentConsumer, SingletonComponentConsumer);

    const componentConsumer: SingletonComponentConsumer = injector.get(
      SingletonComponentConsumer
    );
    const otherComponentConsumer: SingletonComponentConsumer = injector.get(
      SingletonComponentConsumer
    );

    expect(componentConsumer.getComponent()).toBe(
      otherComponentConsumer.getComponent()
    );
  });

  it('should inject to scope component', function () {
    const injector = new Injector();

    injector.bind(Component, CustomComponent);
    injector.bind(ScopeComponentConsumer, ScopeComponentConsumer);

    const componentConsumer: ScopeComponentConsumer = injector.get(
      ScopeComponentConsumer
    );
    const otherComponentConsumer: ScopeComponentConsumer = injector.get(
      ScopeComponentConsumer
    );

    expect(componentConsumer.getComponent()).toBe(
      otherComponentConsumer.getComponent()
    );
  });
});
