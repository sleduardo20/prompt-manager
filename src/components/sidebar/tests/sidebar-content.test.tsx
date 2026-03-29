import { render, screen } from "@/lib/test-utils";
import { SidebarContent, SidebarContentProps } from "../sidebar-content";
import userEvent from "@testing-library/user-event";
import { Prompt } from "@/model/prompt";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

const initialPrompt: Prompt[] = [
  {
    id: "01",
    title: "Title Prompt",
    content: "content",
  },
  {
    id: "02",
    title: "Title Prompt 02",
    content: "content",
  },
];

const makeSut = (
  { prompts = initialPrompt }: SidebarContentProps = {} as SidebarContentProps,
) => {
  return render(<SidebarContent prompts={prompts} />);
};

describe("SidebarContent", () => {
  const user = userEvent.setup();

  describe("Basic", () => {
    it("should be re-rendered to create a new prompt", () => {
      makeSut();

      expect(screen.getByRole("button", { name: "Novo prompt" })).toBeVisible();
      expect(screen.getByRole("complementary")).toBeVisible();
    });

    it.only("should render the list of prompts", () => {
      makeSut();

      expect(screen.getByText(initialPrompt[0].title)).toBeInTheDocument();

      expect(screen.getAllByRole("paragraph")).toHaveLength(
        initialPrompt.length,
      );
    });
  });

  describe("Collapse / Expand", () => {
    it("should start expanded and display the minimize button", () => {
      makeSut();

      const aside = screen.getByRole("complementary");
      expect(aside).toBeVisible();

      const collapseButton = screen.getByRole("button", {
        name: /Colapsar sidebar/i,
      });

      expect(collapseButton).toBeVisible();

      const expandButton = screen.queryByRole("button", {
        name: /Expandir sidebar/i,
      });

      expect(expandButton).not.toBeInTheDocument();
    });

    it("should contract and show the expand button", async () => {
      makeSut();

      const collapseButton = screen.getByRole("button", {
        name: /Colapsar sidebar/i,
      });

      await user.click(collapseButton);

      const expandButton = screen.queryByRole("button", {
        name: /Expandir sidebar/i,
      });

      expect(expandButton).toBeInTheDocument();
      expect(collapseButton).not.toBeInTheDocument();
    });
  });

  describe("New prompt button", () => {
    it("should redirect to the /new route when clicking the new prompt button", async () => {
      makeSut();

      const newPromptButton = screen.getByRole("button", {
        name: /Novo prompt/i,
      });

      await user.click(newPromptButton);

      expect(pushMock).toHaveBeenCalledWith("/new");
    });
  });
});
