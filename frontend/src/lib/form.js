import { createFormHook } from '@tanstack/react-form'
import Form from '@/components/form/Form'
import TextInput from '@/components/form/TextInput'
import { fieldContext, formContext } from './formContext'
import SubmitButton from '@/components/form/SubmitButton'

export { useFieldContext, useFormContext } from './formContext'

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextInput },
  formComponents: { Form, SubmitButton },
})
