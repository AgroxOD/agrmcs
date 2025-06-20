/**
 * Назначение: компонент интерфейса.
 * Основные модули: React, Next.js, Tailwind.
 */
"use client";

import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { login } from "../../_lib/api";
import Button from "../../_components/Button";
import Buttons from "../../_components/Buttons";
import Divider from "../../_components/Divider";
import FormField from "../../_components/FormField";
import FormCheckRadio from "../../_components/FormField/CheckRadio";

type LoginForm = {
  login: string;
  password: string;
  remember: boolean;
};

export default function LoginForm() {
  const router = useRouter();

  const handleSubmit = async (formValues: LoginForm) => {
    await login(formValues.login, formValues.password);
    router.push("/dashboard/tasks");
  };

  const initialValues: LoginForm = {
    login: "john.doe",
    password: "bG1sL9eQ1uD2sK3b",
    remember: true,
  };
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form>
        <FormField label="Login" help="Please enter your login">
          {({ className }) => <Field name="login" className={className} />}
        </FormField>

        <FormField label="Password" help="Please enter your password">
          {({ className }) => (
            <Field name="password" type="password" className={className} />
          )}
        </FormField>

        <FormCheckRadio type="checkbox" label="Remember">
          <Field type="checkbox" name="remember" />
        </FormCheckRadio>

        <Divider />

        <Buttons>
          <Button type="submit" label="Login" color="info" isGrouped />
          <Button
            href="/dashboard"
            label="Home"
            color="info"
            outline
            isGrouped
          />
        </Buttons>
      </Form>
    </Formik>
  );
}
