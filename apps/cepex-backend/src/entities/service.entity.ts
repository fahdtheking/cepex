import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ExporterProfile } from './exporter-profile.entity';

@Entity('services')
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    exporterId: string;

    @ManyToOne(() => ExporterProfile, exporter => exporter.services)
    @JoinColumn({ name: 'exporterId' })
    exporter: ExporterProfile;

    @Column()
    name: string;

    @Column({ nullable: true })
    category: string; // e.g., "Logistics", "Legal", "Consulting"

    @Column('text')
    description: string;

    @Column({ nullable: true })
    priceModel: string; // e.g., "Hourly", "Fixed", "Quote-based"

    @Column({ nullable: true })
    availability: string; // e.g., "Immediate", "2 weeks notice"

    @Column('text', { array: true, default: [] })
    tags: string[];

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
