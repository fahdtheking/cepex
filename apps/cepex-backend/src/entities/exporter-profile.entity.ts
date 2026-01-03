import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Service } from './service.entity';

export enum VerificationStatus {
    UNVERIFIED = 'UNVERIFIED',
    PENDING = 'PENDING',
    VERIFIED = 'VERIFIED',
    REJECTED = 'REJECTED'
}

@Entity('exporter_profiles')
export class ExporterProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    userId: string;

    @OneToOne(() => User, user => user.exporterProfile)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    companyName: string;

    @Column({ unique: true })
    taxId: string;

    @Column({ nullable: true })
    rneId: string;

    @Column()
    address: string;

    @Column()
    sector: string;

    @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.UNVERIFIED })
    status: VerificationStatus;

    @Column({ type: 'enum', enum: ['NONE', 'SILVER', 'GOLD', 'PLATINUM'], default: 'NONE' })
    tier: string;

    @Column({ nullable: true })
    verifiedAt: Date;

    @OneToMany(() => Product, product => product.exporter)
    products: Product[];

    @OneToMany(() => Service, service => service.exporter)
    services: Service[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
