import { RequestHandler } from "express";
import { Note } from "./../entity/Note";
import { AppDataSource } from "./../data-source";
import { AuthenticatedRequest } from "./../middlewares/authorize";
import { User } from "./../entity/User";



export const createNote: RequestHandler = async (
  req: AuthenticatedRequest,
  res,
  next
): Promise<any> => {
  const { userId, rating } = req.body;
  const raterId = req.user?.id;

  const userRepository = AppDataSource.getRepository(User);
  const noteRepository = AppDataSource.getRepository(Note);

  try {
    const user = await userRepository.findOne({ where: { id: userId } });
    const rater = raterId ? await userRepository.findOne({ where: { id: raterId } }) : undefined;

    if (!user) {
      return res.status(404).json({
        message: "Le volontaire à noter n'existe pas",
      });
    }

    // Crée la nouvelle note de manière propre
    const newNoteData: Partial<Note> = {
      user: user,
      rating,
      // Ajoute 'rater' seulement si défini
      ...(rater ? { rater: rater } : {}),
    };

    const newNote = noteRepository.create(newNoteData);

    await noteRepository.save(newNote);

    return res.status(201).json({
      message: "Note créée avec succès",
      note: newNote,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message: "La création de la note a échoué, veuillez réessayer.",
    });
  }
};

export const retrieveNotes: RequestHandler = async (req, res, next): Promise<any> => {
  const noteRepository = AppDataSource.getRepository(Note);
  try {
    const notes = await noteRepository.find({
      relations: ["user", "rater"],
      select: {
        user: { id: true },
        rater: { id: true },
      },
    });

    return res.status(200).json({ notes });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des notes",
    });
  }
};

export const updateNote: RequestHandler<{ id: string }> = async (
  req: AuthenticatedRequest,
  res,
  next
): Promise<any> => {
  const id = req.params.id;
  const { rating } = req.body;
  const noteRepository = AppDataSource.getRepository(Note);

  try {
    const note = await noteRepository.findOne({ where: { id: +id } });

    if (!note) {
      return res.status(404).json({
        message: "La note que vous essayez de mettre à jour n'existe pas",
      });
    }

    note.rating = rating ?? note.rating;

    await noteRepository.save(note);
    return res.status(200).json(note);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message: "Une erreur est survenue lors de la modification de la note",
    });
  }
};

export const deleteNote: RequestHandler<{ id: string }> = async (
  req: AuthenticatedRequest,
  res,
  next
): Promise<any> => {
  const id = req.params.id;
  const noteRepository = AppDataSource.getRepository(Note);

  try {
    const result = await noteRepository.delete(id);

    if (result.affected === 0) {
      return res.status(404).json({
        message: "La note que vous essayez de supprimer n'existe pas",
      });
    }

    return res.status(204).send();
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message: "Une erreur est survenue lors de la suppression de la note",
    });
  }
};
