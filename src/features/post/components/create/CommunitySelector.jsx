import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

export default function CommunitySelector({ communities, selected, onSelect }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">Select a community</label>
      <Listbox value={selected} onChange={onSelect}>
        <div className="relative">
          <Listbox.Button className="w-full bg-input-bg dark:bg-dark-action text-input-text dark:text-white border border-border dark:border-dark-card-bg rounded-lg px-4 py-2 text-left flex items-center justify-between">
            <span className="flex items-center gap-2 truncate">
              {selected?.imageDTO?.imageUrl && (
                <img
                  src={selected.imageDTO.imageUrl}
                  className="w-6 h-6 rounded-full object-cover"
                  alt="community"
                />
              )}
              <span className="truncate">{selected?.name || "Choose a community"}</span>
            </span>
            <ChevronUpDownIcon className="h-5 w-5 text-muted dark:text-muted" />
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-card dark:bg-dark-card-bg py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              {communities.map((c) => (
                <Listbox.Option
                  key={c.id}
                  value={c}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "bg-primary text-white" : "text-foreground dark:text-white"
                    }`
                  }
                >
                  {({ selected }) => (
                    <div className="flex items-center gap-2">
                      <img
                        src={c.imageDTO?.imageUrl}
                        className="w-6 h-6 rounded-full object-cover"
                        alt={c.name}
                      />
                      <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>
                        {c.name}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <CheckIcon className="h-5 w-5 text-white" />
                        </span>
                      )}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
