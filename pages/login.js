import Link from 'next/link';
import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export default function LoginScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Авторизация">
      <form
        className="w-full md:w-4/5 lg:w-1/3 mx-auto bg-slate-100 rounded-xl p-8 dark:bg-slate-800 shadow-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl text-center">Авторизация</h1>
        <div className="pt-6 pace-y-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Пожалуйста, введите email адрес',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Пожалуйста, введите ваш действующий email адрес',
              },
            })}
            className="w-full"
            id="email"
            autoFocus
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            {...register('password', {
              required: 'Пожалуйста введите пароль',
              minLength: {
                value: 6,
                message: 'пароль длиной более 5 символов',
              },
            })}
            className="w-full"
            id="password"
            autoFocus
          ></input>
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4 ">
          <button className="primary-button">Логин</button>
        </div>
        <div className="mb-4 ">
          У вас нет учетной записи? &nbsp;
          <Link href={`/register?redirect=${redirect || '/'}`}>
            Зарегистрируйтесь
          </Link>
        </div>
      </form>
    </Layout>
  );
}
