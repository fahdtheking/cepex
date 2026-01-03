import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Deal } from './deal.entity';

export enum DropPayHandoverStatus {
    PENDING = 'PENDING',
    INITIATED = 'INITIATED',
    COMPLETED = 'COMPLETED',
    REJECTED = 'REJECTED'
}

@Entity('droppay_handovers')
export class DropPayHandover {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    dealId: string;

    @ManyToOne(() => Deal, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'dealId' })
    deal: Deal;

    @Column()
    initiatedBy: string; // User ID who initiated the handover

    @Column({ type: 'enum', enum: DropPayHandoverStatus, default: DropPayHandoverStatus.PENDING })
    status: DropPayHandoverStatus;

    @Column({ nullable: true })
    dropPayDealId: string; // External reference to DropPay platform deal ID

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>; // Additional handover data

    @CreateDateColumn()
    initiatedAt: Date;
}

