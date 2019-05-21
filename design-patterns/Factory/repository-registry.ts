interface Repository { }

interface RepositoryBuilder<T extends Repository> {
    new(dbConnection: any): T;
    getType(): RepositoryEnum;
}

enum RepositoryEnum {
    FooRepository,
    GooRepository
}

class FooRepository implements Repository {
    constructor(private dbConnection: any) { }
    public static getType(): RepositoryEnum {
        return RepositoryEnum.FooRepository;
    }
    public doFoo() { console.log("Foo") }
}

class GooRepository implements Repository {
    constructor(private dbConnection: any) { }
    public static getType(): RepositoryEnum {
        return RepositoryEnum.GooRepository;
    }
    public doGoo() { console.log("Goo") }
}

class RepositoryRegistry {
    private dbConnection: any;
    private repositories: Map<RepositoryEnum, object>;

    constructor(dbConnection: any) {
        this.dbConnection = dbConnection;
        this.repositories = new Map<RepositoryEnum, object>();
    }

    public instanceOf<T extends Repository>(repositoryType: RepositoryBuilder<T>): T {
        const type = repositoryType.getType();
        let repository = <T>this.repositories.get(type);

        if (!repository) {
            repository = <T>this.newRepositoryOfType(type);
            this.repositories.set(type, repository);
        }

        return repository;
    }

    private newRepositoryOfType(type: RepositoryEnum): Repository {
        switch (type) {
            case RepositoryEnum.FooRepository:
                return new FooRepository(this.dbConnection);
            case RepositoryEnum.GooRepository:
                return new GooRepository(this.dbConnection);
        }
    }
}

class DummyService {
    constructor(private registry: RepositoryRegistry) { }

    public doSomethingDummy(): void {
        this.registry.instanceOf(FooRepository).doFoo();
    }

    public doSomethingDumber(): void {
        this.registry.instanceOf(GooRepository).doGoo();
    }
}

(() => {
    const dbConnection: any = null;
    const registry: RepositoryRegistry = new RepositoryRegistry(dbConnection);
    const dummyService = new DummyService(registry);

    dummyService.doSomethingDummy();
    dummyService.doSomethingDumber();
})()
