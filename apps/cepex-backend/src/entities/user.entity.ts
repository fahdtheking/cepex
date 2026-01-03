import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, UpdateDateColumn } from 'typeorm';
import { ExporterProfile } from './exporter-profile.entity';
import { ImporterProfile } from './importer-profile.entity';
import { ArchitectProfile } from './architect-profile.entity';

export enum UserRole {
    EXPORTER = 'EXPORTER',
    IMPORTER = 'IMPORTER',
    ARCHITECT = 'ARCHITECT',
    ADMIN = 'ADMIN'
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.EXPORTER })
    role: UserRole;

    @OneToOne(() => ExporterProfile, profile => profile.user, { nullable: true })
    exporterProfile?: ExporterProfile;

    @OneToOne(() => ImporterProfile, profile => profile.user, { nullable: true })
    importerProfile?: ImporterProfile;

    @OneToOne(() => ArchitectProfile, { nullable: true })
    architectProfile?: ArchitectProfile;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

