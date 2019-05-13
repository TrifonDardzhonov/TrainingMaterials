export interface Repository { }

export interface RepositoryBuilder<T extends Repository> {
    new(): T;
    getType(): RepositoryEnum;
}

export enum RepositoryEnum {
    DummyRepository
}

export class UnitOfWork {
    private repositories: Map<RepositoryEnum, object>;

    constructor(private context: any) {
        this.repositories = new Map<RepositoryEnum, object>();
    }

    public async buildRepository<T extends Repository>(repositoryType: RepositoryBuilder<T>): Promise<T> {
        const type = repositoryType.getType();
        let repository = <T>this.repositories.get(type);
        if (!repository) {
            repository = <T>this.createRepository(type);
            this.repositories.set(type, repository);
        }

        return repository;
    }

    private createRepository(type: RepositoryEnum): Repository {
        switch (type) {
            case RepositoryEnum.DummyRepository:
                return new DummyRepository(this.context, new DummyMapper());
        }
    }
} 

// and then when you wanna get a repository
// const uow: UnitOfWork = new UnitOfWork(context);
// uow.buildRepository(DummyRepository) is gonna return DummyRepository;
