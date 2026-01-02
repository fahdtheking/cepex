import { MigrationInterface, QueryRunner } from 'typeorm';

export class Blank00000000000000 implements MigrationInterface {
  name = 'Blank00000000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Intentionally blank migration scaffold for manual edits and review.
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Intentionally blank down migration.
  }
}
