import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { register, login } from "../redux/userSlice";
import InputField from "./InputField";
import RoleSelector from "./RoleSelector";
import ErrorMessage from "./ErrorMessage";
import type { RootState } from "../redux/store";

const AuthForm: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const dispatch = useAppDispatch();
  const error = useAppSelector(
    (state: RootState) =>
      (state.user as { error?: string | null }).error ?? null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      dispatch(register(form));
    } else {
      dispatch(login({ nickname: form.nickname, password: form.password }));
    }
  };

  return (
    <div className="card">
      <div className="auth-form">
        <h2>{isRegister ? "Регистрация" : "Вход"}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <InputField
                label="Имя"
                type="text"
                value={form.firstName}
                name="firstName"
                onChange={handleChange}
                required
              />
              <InputField
                label="Фамилия"
                type="text"
                value={form.lastName}
                name="lastName"
                onChange={handleChange}
                required
              />
              <InputField
                label="Email"
                type="email"
                value={form.email}
                name="email"
                onChange={handleChange}
                required
              />
              <RoleSelector
                value={form.role}
                name="role"
                onChange={handleChange}
              />
            </>
          )}
          <InputField
            label="Никнейм"
            type="text"
            value={form.nickname}
            name="nickname"
            onChange={handleChange}
            required
          />
          <InputField
            label="Пароль"
            type="password"
            value={form.password}
            name="password"
            onChange={handleChange}
            required
          />
          {isRegister && (
            <InputField
              label="Подтверждение пароля"
              type="password"
              value={form.confirmPassword}
              name="confirmPassword"
              onChange={handleChange}
              required
            />
          )}
          <ErrorMessage
            message={
              error === "Никнейм уже занят"
                ? "Этот никнейм уже используется. Пожалуйста, выберите другой."
                : error === "Email уже занят"
                ? "Этот email уже используется. Пожалуйста, выберите другой."
                : error ?? null
            }
          />
          <button type="submit">
            {isRegister ? "Зарегистрироваться" : "Войти"}
          </button>
        </form>
      </div>
      <button
        className="switch-link"
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister
          ? "Уже есть аккаунт? Войти"
          : "Нет аккаунта? Зарегистрироваться"}
      </button>
    </div>
  );
};

export default AuthForm;
