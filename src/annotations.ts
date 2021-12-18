export type Constructor<T = any> = new (...args: any[]) => T;

export const CLASS_KEY = 'di:tagged_class';
export const DEPENDENCIES_KEY = 'di:inject_dependencies';
export const DEPENDENCIES_NAME = 'di:inject_named';
export const CLASS_SINGLETON = 'di:singleton_class';
export const SCOPE = 'di:scope';

export function Injectable(args?: any[]) {
  return function (target: Constructor) {
    Reflect.defineMetadata(
      CLASS_KEY,
      {
        id: target,
        args: args || [],
      },
      target
    );
    return target;
  };
}

export function Inject() {
  return function (target: any, propertyName: string) {
    const annotationTarget = target.constructor;
    const propertyType = Reflect.getMetadata(
      'design:type',
      target,
      propertyName
    );
    let dependencies: { [key: string]: any } = {};
    if (Reflect.hasOwnMetadata(DEPENDENCIES_KEY, annotationTarget)) {
      dependencies = Reflect.getMetadata(DEPENDENCIES_KEY, annotationTarget);
    }
    dependencies[propertyName] = {
      value: propertyType,
    };
    Reflect.defineMetadata(DEPENDENCIES_KEY, dependencies, annotationTarget);
  };
}

export function Named(name: string) {
  return function (target: any, propertyName?: string) {
    if (propertyName) {
      const annotationTarget = target.constructor;
      const propertyType = Reflect.getMetadata(
        'design:type',
        target,
        propertyName
      );
      let dependencies: { [key: string]: any } = {};
      if (Reflect.hasOwnMetadata(DEPENDENCIES_KEY, annotationTarget)) {
        dependencies = Reflect.getMetadata(DEPENDENCIES_KEY, annotationTarget);
      }
      dependencies[propertyName] = {
        name,
        value: propertyType,
      };
      Reflect.defineMetadata(DEPENDENCIES_KEY, dependencies, annotationTarget);
      return;
    } else {
      Reflect.defineMetadata(DEPENDENCIES_NAME, name, target.prototype);
      return target;
    }
  };
}

export function Qualifier({ value }: { value: string }) {
  return function (target: any, propertyName?: string) {
    if (propertyName) {
      const annotationTarget = target.constructor;
      const propertyType = Reflect.getMetadata(
        'design:type',
        target,
        propertyName
      );
      let dependencies: { [key: string]: any } = {};
      if (Reflect.hasOwnMetadata(DEPENDENCIES_KEY, annotationTarget)) {
        dependencies = Reflect.getMetadata(DEPENDENCIES_KEY, annotationTarget);
      }
      dependencies[propertyName] = {
        name: value,
        value: propertyType,
      };
      Reflect.defineMetadata(DEPENDENCIES_KEY, dependencies, annotationTarget);
      return;
    } else {
      Reflect.defineMetadata(DEPENDENCIES_NAME, value, target.prototype);
      return target;
    }
  };
}

export function Singleton() {
  return function (target: any, propertyName: string) {
    const propertyType = Reflect.getMetadata(
      'design:type',
      target,
      propertyName
    );
    Reflect.defineMetadata(
      CLASS_SINGLETON,
      Reflect.construct(propertyType, []),
      propertyType
    );
  };
}

export function Scope(scopeName: string) {
  return function (target: any, propertyName: string) {
    const propertyType = Reflect.getMetadata(
      'design:type',
      target,
      propertyName
    );
    let scopes: any[] = [];
    try {
      scopes = Reflect.getMetadata(SCOPE, scopeName);
    } catch (error) {}

    if (!scopes?.length) {
      Reflect.defineMetadata(SCOPE, [], propertyType);
      scopes = [];
    }
    if (scopes.find((el: any) => el.scopeName === scopeName)) {
      return;
    } else {
      const scopeDependency = {
        instance: Reflect.construct(propertyType, []),
        scopeName,
      };
      scopes.push(scopeDependency);
      Reflect.defineMetadata(SCOPE, scopes, propertyType);
    }
  };
}
