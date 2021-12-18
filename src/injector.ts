import 'reflect-metadata';

import {
  Constructor,
  CLASS_KEY,
  DEPENDENCIES_KEY,
  DEPENDENCIES_NAME,
  CLASS_SINGLETON,
  SCOPE,
} from './annotations';

export class Injector {
  private map = new Map<Constructor, any>();

  bind<T>(token: Constructor<T>, injectableClass: any, args?: any[]) {
    const name = Reflect.getMetadata(
      DEPENDENCIES_NAME,
      injectableClass.prototype ?? injectableClass.__proto__
    );
    if (!name) {
      this.map.set(token, {
        injectableClass,
        args: args || [],
      });
      return;
    }

    if (this.map.has(token)) {
      const dependencies = this.map.get(token);
      this.map.set(token, [
        ...dependencies,
        {
          name,
          injectableClass,
          args: args || [],
        },
      ]);
    } else {
      this.map.set(token, [
        {
          name,
          injectableClass,
          args: args || [],
        },
      ]);
    }
  }

  get<T>(token: Constructor<T>): any {
    const bindings = this.map.get(token);
    if (Array.isArray(bindings)) {
      // named
      return bindings.map(({ name, injectableClass, args }) => {
        return {
          name,
          value: injectableClass.prototype
            ? Reflect.construct(injectableClass, args)
            : injectableClass,
        };
      });
    }

    const { injectableClass, args } = bindings;
    // ** singleton start **
    const singleClass = Reflect.getMetadata(CLASS_SINGLETON, injectableClass);
    if (singleClass) return singleClass;
    // **singleton end **

    // ** scope start **
    // const scopeDependency = Reflect.getMetadata(SCOPE, injectableClass);
    // if (scopeDependency) return scopeDependency;
    // **scope end **
    const dependencies = Reflect.getMetadata(DEPENDENCIES_KEY, injectableClass);
    const instance = injectableClass.prototype
      ? Reflect.construct(injectableClass, args)
      : injectableClass;
    for (let dependency in dependencies) {
      const token = dependencies[dependency].value;
      const name = dependencies[dependency].name;
      if (name) {
        instance[dependency] = this.get(token).find(
          (el: any) => el.name === name
        ).value;
      } else {
        // 递归获取依赖
        instance[dependency] = this.get(token);
      }
    }
    return instance;
  }
}

// export function register(injector: Injector, InjectableClasses: any[]) {
//   InjectableClasses.forEach((InjectableClass) => {
//     const metadata = Reflect.getMetadata(CLASS_KEY, InjectableClass);
//     if (metadata) {
//       injector.bind(metadata.id, InjectableClass, metadata.args);
//     }
//   });
// }
