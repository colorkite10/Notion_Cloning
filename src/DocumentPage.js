import { request } from "./api.js";
import DocumentList from "./DocumentList.js";
import { push } from "./router.js";
import { setItem, removeItem } from "./storage.js";

export default function DocumentPage({ $target, initialState }) {
  const $documentPage = document.createElement("div");

  $documentPage.className = "DocumentPage";

  this.state = initialState;

  this.setState = async (nextState) => {
    this.state = nextState;

    documentList.setState({
      ...this.state,
      nextState,
    });
  };

  const documentList = new DocumentList({
    $target: $documentPage,
    initialState,
    onCreateDocument: async (id) => {
      const createdDoc = await request("/documents", {
        method: "POST",
        body: JSON.stringify({
          title: "Untitled",
          parent: id,
        }),
      });

      await request(`/documents/${createdDoc.content}`, {
        method: "PUT",
        body: JSON.stringify({
          title: "Untitled",
          content: "nothing",
        }),
      });

      setItem(id, {
        id: id,
      });

      push(`/documents/${createdDoc.id}`);
    },
    onDeleteDocument: async (id) => {
      const deletedDoc = async (id) => {
        await request(`/documents/${id}`, {
          method: "DELETE",
        });
        removeItem(id);
        removeItem(`temp-document-${id}`);
      };

      await deletedDoc(id);
      push("/");
    },
  });

  this.render = () => {
    $target.appendChild($documentPage);
  };

  this.render();
}
