import { User } from "../../users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Persona {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string

    @Column()
    apellido: string

    @Column()
    sexo: string

    @OneToOne(() => User, user => user.persona)
    @JoinColumn()
    user: User
}
