import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

export enum ArchitectTier {
    BRONZE = 'BRONZE',
    SILVER = 'SILVER',
    GOLD = 'GOLD',
    PLATINUM = 'PLATINUM'
}

export enum CommissionModel {
    FIXED = 'FIXED',        // Fixed fee per deal
    PERCENTAGE = 'PERCENTAGE', // % of deal value
    HYBRID = 'HYBRID'       // Base + %
}

/**
 * Deal Architect Profile
 * Tracks performance, portfolio metrics, and earnings
 */
@Entity('architect_profiles')
export class ArchitectProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ unique: true })
    userId: string;

    // Portfolio Metrics (cached for performance)
    @Column({ default: 0 })
    managedDealsCount: number;

    @Column({ default: 0 })
    completedDealsCount: number;

    @Column({ type: 'float', default: 0 })
    successRate: number; // % of deals reaching EXECUTION/COMPLETED

    @Column({ type: 'float', default: 0 })
    averageDealValue: number; // In EUR

    @Column({ type: 'float', default: 0 })
    totalValueManaged: number; // Cumulative

    // Negotiation Performance
    @Column({ type: 'float', default: 0 })
    averageNegotiationVelocity: number; // Days from DISCOVERY to first accepted proposal

    @Column({ type: 'float', default: 0 })
    proposalWinRate: number; // Accepted / Total proposals

    @Column({ type: 'float', default: 0 })
    averageIterationCount: number; // How many counter-proposals before acceptance

    // Specializations
    @Column({ type: 'simple-array', nullable: true })
    sectors: string[]; // e.g., ['Agriculture', 'Healthcare']

    @Column({ type: 'simple-array', nullable: true })
    regions: string[]; // e.g., ['EU', 'MENA']

    // Economic Model
    @Column({ type: 'enum', enum: CommissionModel, default: CommissionModel.PERCENTAGE })
    commissionModel: CommissionModel;

    @Column({ type: 'float', default: 2.5 })
    commissionRate: number; // 2.5% default

    @Column({ type: 'float', default: 0 })
    totalEarnings: number; // Cumulative in EUR

    // Tier & Status
    @Column({ type: 'enum', enum: ArchitectTier, default: ArchitectTier.BRONZE })
    tier: ArchitectTier;

    @Column({ default: true })
    isActive: boolean;

    // Performance History (JSONB for flexibility)
    @Column({ type: 'jsonb', nullable: true })
    monthlyPerformance: Array<{
        month: string; // YYYY-MM
        dealsCompleted: number;
        revenue: number;
        winRate: number;
    }>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
