    import { Schema, model, models, Model, Document } from 'mongoose';

    interface IGeneration extends Document {
      userId: Schema.Types.ObjectId;
      prompt: string;
      response: string;
      createdAt: Date;
    }

    const GenerationSchema = new Schema<IGeneration>({
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      prompt: {
        type: String,
        required: [true, 'O prompt é obrigatório.'],
      },
      response: {
        type: String,
        required: [true, 'A resposta da IA é obrigatória.'],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

    const Generation: Model<IGeneration> = models?.Generation || model<IGeneration>('Generation', GenerationSchema);

    export default Generation;
