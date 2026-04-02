"use client";

import type { HiddenFieldProps } from "@/components/forms/fields/types";

export function HiddenField(props: HiddenFieldProps) {
  return <input name={props.name} type="hidden" value={props.value} />;
}
