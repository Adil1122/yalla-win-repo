'use client'

import { useState } from 'react'
import { Field, Label, Switch } from '@headlessui/react'

interface SwitchComponentProps {
   isEnabled: boolean;
   onToggle: (value: boolean) => void;
   label: string;
}

export const SwitchComponent: React.FC<SwitchComponentProps> = ({ isEnabled, onToggle, label }) => {
   return (
      <Field className="flex items-center">
         <Switch checked={isEnabled} onChange={onToggle} className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-[checked]:bg-indigo-600">
            <span aria-hidden="true" className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5" />
         </Switch>
         <Label as="span" className="ml-3 text-sm">
            <span className="font-medium text-gray-900">{label}</span>
         </Label>
      </Field>
   )
}