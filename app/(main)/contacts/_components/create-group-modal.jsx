import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { UserPlus, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { add, set } from "date-fns";
import { toast } from "sonner";

const CreateGroupModal = ({ isOpen, onClose, onSuccess }) => {
  // for selected members
  const [selectedMembers, setSelectedMembers] = useState([]);

  // addMember function
  const addMember = (user) => {
    if (!selectedMembers.some((m) => m.id === user.id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
    setCommandOpen(false); // close the popover after adding a member
  };

  // removeMember function
  const removeMember = (userId) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== userId));
  };

  // for searching usernames to add to group
  const [searchQuery, setSearchQuery] = useState("");

  const [commandOpen, setCommandOpen] = useState(false);

  // all these queries are in user.js

  // bring the current user data from user.js
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser); // rename data as currentUser

  // querying ti search user in the database
  const { data: searchResults, isLoading: isSearching } = useConvexQuery(
    api.users.searchUsers,
    { query: searchQuery }
  );

  const createGroup = useConvexMutation(api.contacts.createGroup);

  // Define the schema for the group creation form for zod validation
  const groupSchema = z.object({
    name: z.string().min(1, "Group name is required"),
    description: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleClose = () => {
    // reset form state if needed
    reset();
    setSelectedMembers([]); // clear selected members
    onClose();
  };

  // handle form submission

  const onSubmit = async (data) => {
    try {
      const memberIds = selectedMembers?.map((member) => member.id);

      const groupId = await createGroup.mutate({
        name: data.name,
        description: data.description,
        members: memberIds,
      });
      toast.success("Group created successfully !!");
      handleClose(); // close the modal after successful creation
      if (onSuccess) onSuccess(groupId);
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group." + error.message);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
      className="flex flex-col max-h-[90vh] overflow-hidden"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col flex-grow overflow-hidden"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              placeholder="Enter group name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description(Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter the description"
              {...register("description")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Members</Label>
            <div className="flex flex-wrap gap-2 mb-2 max-h-40 overflow-y-auto pr-2">
              {currentUser && (
                <Badge variant="secondary" className="px-3 py-1">
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarImage src={currentUser.imageUrl} />
                    <AvatarFallback>
                      {currentUser.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{currentUser.name} (You)</span>
                </Badge>
              )}

              {/*selected members will be displayed here*/}
              {selectedMembers.map((member) => (
                <Badge
                  key={member.id}
                  variant="secondary"
                  className="px-3 py-1"
                >
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarImage src={member.imageUrl} />
                    <AvatarFallback>
                      {member.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{member.name}</span>
                  <span>{member.name}</span>
                  <span className="ml-2 text-muted-foreground hover:text-foreground">
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeMember(member.id)}
                    />
                  </span>
                </Badge>
              ))}

              {/* add user to selected members */}
              <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                <PopoverTrigger>
                  <Button
                    variant="outline"
                    type="button"
                    size="sm"
                    className="h-8 gap-1 text-xs"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Add Members
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start" side="bottom">
                  <Command>
                    <CommandInput
                      placeholder="Search by name or email"
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {searchQuery.length < 2 ? (
                          <p className="py-3 px-4 text-sm text-centre text-muted-foreground">
                            Type at least 2 characters to search
                          </p>
                        ) : isSearching ? (
                          <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                            Searching...
                          </p>
                        ) : (
                          <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                            No users found
                          </p>
                        )}
                      </CommandEmpty>
                      <CommandGroup heading="Users">
                        {searchResults?.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.name + user.email}
                            onSelect={() => addMember(user)}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5 mr-2">
                                <AvatarImage src={user.imageUrl} />
                                <AvatarFallback>
                                  {user.name?.charAt(0) || "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-sm">{user.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {selectedMembers.length === 0 && (
              <p className="text-sm text-red-500">
                Add atleast one member to the group
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || selectedMembers.length === 0}
            >
              {isSubmitting ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
