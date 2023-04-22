import { useState } from "react";
import "./styles/global.css";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty("O nome é obrigatório.")
    .transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
  email: z
    .string()
    .nonempty("O e-mail é obrigatório.")
    .email("Formato de e-mail inválido.")
    .toLowerCase(),
  password: z.string().min(6, "A senha precisa conter no mínimo 6 caracteres."),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty("O título é obrigatório."),
        knowledge: z.coerce
          .number()
          .min(1, "O número deve ser maior ou igual a 1.")
          .max(100, "O número deve ser menor ou igual a 100."),
      })
    )
    .min(2, "Insira pelo menos 2 tecnologias."),
});

type createUserFormData = z.infer<typeof createUserFormSchema>;

function App() {
  const [output, setOutput] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<createUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "techs",
  });

  function addNewTech() {
    append({ title: "", knowledge: 0 });
  }

  function createUser(data: any) {
    setOutput(JSON.stringify(data, null, 2));
  }

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center">
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold">Cadastro de usuário</h1>
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Nome:</label>
          <input
            id="name"
            type="text"
            className="border border-zinc-800 bg-zinc-900 text-white shadow-sm rounded h-10 px-3"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">E-mail:</label>
          <input
            id="email"
            type="email"
            className="border border-zinc-800 bg-zinc-900 text-white shadow-sm rounded h-10 px-3"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Senha:</label>
          <input
            id="password"
            type="password"
            className="border border-zinc-800 bg-zinc-900 text-white shadow-sm rounded h-10 px-3"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="" className="flex items-center justify-between">
            Tecnologias:
            <button
              type="button"
              onClick={addNewTech}
              className="text-emerald-700 text-sm"
            >
              Adicionar
            </button>
          </label>

          {fields.map((field, index) => {
            return (
              <div key={field.id} className="flex gap-2">
                <div className="flex flex-1 flex-col gap-1">
                  <input
                    id="title"
                    type="text"
                    className="border border-zinc-800 bg-zinc-900 text-white shadow-sm rounded h-10 px-3"
                    {...register(`techs.${index}.title`)}
                  />
                  {errors.techs?.[index]?.title && (
                    <span>{errors.techs?.[index]?.title?.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    id="title"
                    type="number"
                    className="w-20 border border-zinc-800 bg-zinc-900 text-white shadow-sm rounded h-10 px-3"
                    {...register(`techs.${index}.knowledge`)}
                  />
                  {errors.techs?.[index]?.knowledge && (
                    <span>{errors.techs?.[index]?.knowledge?.message}</span>
                  )}
                </div>
              </div>
            );
          })}
          {errors.techs && (
            <span className="text-red-500 text-sm">{errors.techs.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-emerald-700 rounded font-semibold text-white h-10 hover:bg-emerald-800"
        >
          Salvar
        </button>
      </form>

      <pre className="bg-zinc-800 w-full max-w-sm overflow-auto">{output}</pre>
    </main>
  );
}

export default App;
