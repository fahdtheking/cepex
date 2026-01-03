import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ExporterProfile } from './exporter-profile.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    exporterId: string;

    @ManyToOne(() => ExporterProfile, exporter => exporter.products)
    @JoinColumn({ name: 'exporterId' })
    exporter: ExporterProfile;

    @Column()
    name: string;

    @Column({ nullable: true })
    hsCode: string;

    @Column()
    description: string;

    @Column('text', { array: true, default: [] })
    images: string[];

    @Column({ nullable: true })
    priceRange: string; // e.g. "1000-5000 EUR" or JSON

    @Column({ nullable: true })
    capacity: string; // e.g. "5000 units/month"

    @Column({ nullable: true })
    category: string; // e.g. "Agri-food", "Textile"

    @Column({ default: false })
    isPublic: boolean;
}
