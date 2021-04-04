import { useCallback, useRef, useState } from "react";
import useTodoPage from "./useTodoPage";
import { ListGroupItem, ListGroup } from "react-bootstrap";

function App() {
    const [page, setPage] = useState(1);

    const { todos, loading, hasMore } = useTodoPage(page);

    const bottomObserver = useRef<any>();

    const lastTodoRef = useCallback(
        (div) => {
            if (loading) return;
            if (bottomObserver.current) bottomObserver.current.disconnect();
            bottomObserver.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage(page + 1);
                }
            });
            if (div) {
                bottomObserver.current.observe(div);
            }
        },
        [loading, hasMore]
    );

    const topObserver = useRef<any>();

    const midElement = useCallback(
        (div) => {
            if (loading) return;
            if (div) {
                div.scrollIntoView();
            }
        },
        [page]
    );

    const firstTodoRef = useCallback(
        (div) => {
            if (loading) return;
            if (topObserver.current) topObserver.current.disconnect();
            topObserver.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && page > 1) {
                    setPage(page - 1);
                }
            });
            if (div) {
                topObserver.current.observe(div);
            }
        },
        [loading]
    );

    return (
        <>
            <ListGroup>
                {todos.map((todo, index) => {
                    if (index === 0) {
                        return (
                            <ListGroupItem
                                key={todo.id}
                                style={{ height: "200px" }}
                                ref={firstTodoRef}
                            >
                                {todo.id} {todo.title}
                            </ListGroupItem>
                        );
                    } else if (index === todos.length - 6) {
                        return (
                            <ListGroupItem
                                key={todo.id}
                                style={{ height: "200px" }}
                                ref={midElement}
                            >
                                {todo.id} {todo.title}
                            </ListGroupItem>
                        );
                    } else {
                        return (
                            <ListGroupItem
                                key={todo.id}
                                style={{ height: "200px" }}
                            >
                                {todo.id} {todo.title}
                            </ListGroupItem>
                        );
                    }
                })}
                <div ref={lastTodoRef}>{loading && "Loading..."}</div>
            </ListGroup>
        </>
    );
}

export default App;
