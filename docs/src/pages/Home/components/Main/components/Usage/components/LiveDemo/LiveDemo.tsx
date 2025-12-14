import {
  HStack,
  VStack,
  Text,
  TextInput,
  MultiSelect,
  Textarea,
  Switch,
  Button,
} from '@vapor-ui/core';
import { FormBackup } from 'form-backup';
import { Dispatch, SetStateAction } from 'react';

import { LabelGroup } from '..';
import { initialiFormData, skills, FormData, Skill } from '../../Usage';

interface LiveDemoProps {
  backup: FormBackup;
  setFormData: Dispatch<SetStateAction<FormData>>;
  formData: FormData;
  updateStorageInfo: () => void;
}

export default function LiveDemo(props: LiveDemoProps) {
  const { backup, setFormData, formData, updateStorageInfo } = props;

  return (
    <VStack
      render={
        <form
          onSubmit={(e) => {
            e.preventDefault();

            backup.clear();
            setFormData(initialiFormData);
            updateStorageInfo();
          }}
        >
          <HStack justifyContent="space-between">
            <VStack gap="$500">
              <VStack gap="$100">
                <Text typography="heading2" color="var(--vapor-color-gray-800)">
                  Live Demo
                </Text>
                <Text typography="body2" foreground="normal-100">
                  Fill out the form, refresh the page, and watch your data
                  restore automatically.
                </Text>
              </VStack>

              <VStack gap="$500" width="100%" maxWidth="500px">
                <VStack gap="$150">
                  <LabelGroup htmlFor="name-input" label="Name" required>
                    <TextInput
                      id="name-input"
                      required
                      size="lg"
                      placeholder="Name"
                      value={formData.name as string}
                      onChange={(e) => {
                        setFormData((prev) => {
                          const newData = { ...prev, name: e.target.value };
                          backup.save(newData);
                          updateStorageInfo();
                          return newData;
                        });
                      }}
                      padding="$200"
                    />
                  </LabelGroup>

                  <LabelGroup htmlFor="email-input" label="Email" required>
                    <TextInput
                      id="email-input"
                      type="email"
                      required
                      size="lg"
                      placeholder="Email address"
                      value={formData.email as string}
                      onChange={(e) => {
                        setFormData((prev) => {
                          const newData = { ...prev, email: e.target.value };
                          backup.save(newData);
                          updateStorageInfo();
                          return newData;
                        });
                      }}
                      padding="$200"
                    />
                  </LabelGroup>

                  <LabelGroup htmlFor="skills-multi-select" label="Skills">
                    <MultiSelect.Root
                      placeholder="Select your Skills"
                      items={skills}
                      value={formData.skills as string[]}
                      onValueChange={(values) => {
                        setFormData((prev) => {
                          const newData = {
                            ...prev,
                            skills: values as Skill[],
                          };
                          backup.save(newData);
                          updateStorageInfo();
                          return newData;
                        });
                      }}
                    >
                      <MultiSelect.Trigger id="skills-multi-select" />
                      <MultiSelect.Popup>
                        {skills.map((skill) => (
                          <MultiSelect.Item
                            key={skill.value}
                            value={skill.value}
                          >
                            {skill.label}
                          </MultiSelect.Item>
                        ))}
                      </MultiSelect.Popup>
                    </MultiSelect.Root>
                  </LabelGroup>

                  <LabelGroup htmlFor="message-textarea" label="Message">
                    <Textarea
                      id="message-textarea"
                      size="lg"
                      placeholder="Your message"
                      value={formData.message as string}
                      onChange={(e) => {
                        setFormData((prev) => {
                          const newData = {
                            ...prev,
                            message: e.target.value,
                          };
                          backup.save(newData);
                          updateStorageInfo();
                          return newData;
                        });
                      }}
                      padding="$200"
                      minHeight="120px"
                    />
                  </LabelGroup>

                  <LabelGroup
                    htmlFor="newsletter-switch"
                    label="Subscribe to newsletter"
                  >
                    <Switch.Root
                      id="newsletter-switch"
                      checked={formData.newsletter as boolean}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => {
                          const newData = { ...prev, newsletter: checked };
                          backup.save(newData);
                          updateStorageInfo();
                          return newData;
                        })
                      }
                    />
                  </LabelGroup>

                  <Button size="lg" marginTop="$300" type="submit">
                    Submit
                  </Button>
                </VStack>
              </VStack>
            </VStack>
          </HStack>
        </form>
      }
      height="100%"
      padding="$300"
      borderRadius="$400"
      backgroundColor="$canvas-200"
    />
  );
}
