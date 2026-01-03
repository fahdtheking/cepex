import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum VerificationStatus {
    UNVERIFIED = 'UNVERIFIED',
    PENDING = 'PENDING',
    VERIFIED = 'VERIFIED',
    REJECTED = 'REJECTED'
}

@Entity('importer_profiles')
export class ImporterProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    userId: string;

    @OneToOne(() => User, user => user.importerProfile)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    companyName: string;

    @Column({ unique: true })
    taxId: string;

    @Column({ nullable: true })
    website: string;

    @Column()
    address: string;

    @Column()
    sector: string;

    // Specific to Importers
    @Column({ type: 'simple-array', nullable: true })
    interestedCategories: string[];

    @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.UNVERIFIED })
    status: VerificationStatus;

    @Column({ nullable: true })
    verifiedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
