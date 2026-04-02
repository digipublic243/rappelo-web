"use client";

import { cn } from "@/lib/cn";
import { formFieldMutedInputClassName } from "@/components/forms/form-styles";
import { CheckboxField } from "@/components/forms/fields/CheckboxField";
import { HiddenField } from "@/components/forms/fields/HiddenField";
import { InputField } from "@/components/forms/fields/InputField";
import { PhoneField } from "@/components/forms/fields/PhoneField";
import { RadioGroupField } from "@/components/forms/fields/RadioGroupField";
import { SelectField } from "@/components/forms/fields/SelectField";
import { TextareaField } from "@/components/forms/fields/TextareaField";
import type { FormFieldProps } from "@/components/forms/fields/types";

export type { FormFieldProps } from "@/components/forms/fields/types";

export function FormField(props: FormFieldProps) {
  if (props.type === "hidden") {
    return <HiddenField {...props} />;
  }

  if (props.type === "phone") {
    return <PhoneField {...props} />;
  }

  if (props.type === "textarea") {
    return <TextareaField {...props} />;
  }

  if (props.type === "select") {
    return <SelectField {...props} />;
  }

  if (props.type === "checkbox") {
    return <CheckboxField {...props} />;
  }

  if (props.type === "radio-group") {
    return <RadioGroupField {...props} />;
  }

  return <InputField {...props} />;
}

export function FormFieldMuted(props: FormFieldProps) {
  if ("inputClassName" in props) {
    return (
      <FormField
        {...props}
        inputClassName={cn(formFieldMutedInputClassName, props.inputClassName)}
      />
    );
  }

  return <FormField {...props} />;
}
