import ArrowDownIcon from '@teable-group/ui-lib/icons/app/arrow-down.svg';
import SelectIcon from '@teable-group/ui-lib/icons/app/select.svg';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type IProps<T = { id: string; name: string }> = {
  selectedId?: string;
  placeholder?: string;
  candidates?: T[];
  onChange?: (id: string) => void;
};

export const Selector: React.FC<IProps> = (props) => {
  const { selectedId = '', onChange, candidates = [] } = props;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          disabled={!candidates.length}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {selectedId ? candidates.find(({ id }) => id === selectedId)?.name : ''}
          <ArrowDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" style={{ width: ref.current?.offsetWidth }}>
        <Command>
          <CommandInput placeholder="Find a field..." />
          <CommandEmpty>No found.</CommandEmpty>
          <CommandGroup>
            {candidates.map(({ id, name }) => (
              <CommandItem
                key={id}
                value={id}
                onSelect={() => {
                  onChange?.(id);
                  setOpen(false);
                }}
              >
                <SelectIcon
                  className={classNames(
                    'mr-2 h-4 w-4',
                    id === selectedId ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};