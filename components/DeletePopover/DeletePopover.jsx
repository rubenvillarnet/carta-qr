import React from 'react';
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Text
} from '@chakra-ui/react';

export default function DeletePopover({ title, text, handleDelete, children }) {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent ml='4'>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader color='red'>{title}</PopoverHeader>
        <PopoverBody>
          <Text mb='2' fontSize='0.9rem'>
            {text}
          </Text>
          <Button colorScheme='red' onClick={handleDelete}>
            Borrar
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
