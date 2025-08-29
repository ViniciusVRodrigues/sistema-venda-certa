import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface EnderecoAttributes {
  id: number;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  favorito: boolean;
  fk_usuario_id: number;
}

interface EnderecoCreationAttributes extends Optional<EnderecoAttributes, 'id'> {}

class Endereco extends Model<EnderecoAttributes, EnderecoCreationAttributes> implements EnderecoAttributes {
  public id!: number;
  public rua!: string;
  public numero!: string;
  public complemento?: string;
  public bairro!: string;
  public cidade!: string;
  public estado!: string;
  public cep!: string;
  public favorito!: boolean;
  public fk_usuario_id!: number;
}

Endereco.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rua: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    numero: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    complemento: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    bairro: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    cidade: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    cep: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    favorito: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    fk_usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'endereco',
    timestamps: false,
  }
);

export default Endereco;