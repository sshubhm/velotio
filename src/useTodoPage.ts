import axios from "axios";
import { useEffect, useState } from "react";
import Todo from "./models/todo";

const useTodoPage = (pageNumber: number) => {
    const [todos, setTodos] = useState<Array<Todo>>([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:3001/todo?_page=${pageNumber}&&_limit=5`).then((res) => {
            if(currentPage < pageNumber){
                setTodos((prevTodo) => {
                    if(res.data.length === 0){
                        setHasMore(false);
                    }
                    const todo = [...prevTodo, ...res.data];
                    if(todo.length > 10){
                        return todo.slice(todo.length - 10);
                    }
                    return todo;
                    
                });
                setCurrentPage(pageNumber);
            }else{
                setTodos((prevTodo)=>{
                    const todo = [...res.data, ...prevTodo];
                    if(todo.length > 10){
                        return todo.slice(0,10);
                    }
                    return todo;
                });
                setCurrentPage(pageNumber);
            }
            
            setLoading(false);
        });
    }, [pageNumber]);

    return {todos, loading, hasMore};
};

export default useTodoPage;
