import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AvaliacaoProdutoAttributes {
  id: number;
  avaliacao: number;
  comentario?: string;
  fk_produto_id: number;
  fk_usuario_id: number;
}

interface AvaliacaoProdutoCreationAttributes extends Optional<AvaliacaoProdutoAttributes, 'id'> {}

class AvaliacaoProduto extends Model<AvaliacaoProdutoAttributes, AvaliacaoProdutoCreationAttributes> implements AvaliacaoProdutoAttributes {
  public id!: number;
  public avaliacao!: number;
  public comentario?: string;
  public fk_produto_id!: number;
  public fk_usuario_id!: number;
}

AvaliacaoProduto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    avaliacao: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fk_produto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'produto',
        key: 'id',
      },
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
    tableName: 'avaliacaoProduto',
    timestamps: false,
  }
);

export default AvaliacaoProduto;