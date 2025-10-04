import { createFormHookContexts } from '@tanstack/react-form'

// export useFieldContext/useFormContext for use in custom components
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()
