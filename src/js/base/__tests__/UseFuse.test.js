import { useFuse } from "../hooks";
import { act, renderHook } from "@testing-library/react-hooks";

describe("useFuseHook", () => {
    let collection;
    let keys; 
    let deps; 

    beforeEach(()=>{
        collection = [{name: "nan"}, {name: "test1"}, {name: "aaaaa"}, {name: "zzzzz"}];
        keys = ['name'];
        deps = ['zzz'];
    })

    it("term = empty string and return object = collection and component mounts correctly", ()=> {
        const { result } = renderHook(() => useFuse(collection, keys, deps));
        const [ returnObj, term, setTerm] = result.current;
        const length = result.current.length;
        expect(length).toBe(3);
        expect(result.current[0]).toBe(collection);
        expect(result.current[1]).toBe("");
    })
    
    it("after term changed to non empty string returnObj should change", () => {
        const { result } = renderHook(() => useFuse(collection, keys, deps));
        const [ returnObj, term, setTerm] = result.current;

        act(() => {
            setTerm("z");
        });
        expect(result.current[0]).toEqual( [ { item: { name: 'zzzzz' }, refIndex: 3 } ]);
        expect(result.current[1]).toBe("z"); 
    });

    it("searchFuse that yields no matches will return the original results", ()=> {
        const { result } = renderHook(() => useFuse(collection, keys, deps));
        const [ returnObj, term, setTerm] = result.current;
        
        act(()=> {
            setTerm("wwwwwwwww");
        });
        expect(result.current[1]).toBe("wwwwwwwww");
        expect(result.current[0]).toEqual([]);
    });

    it("when the term is changed from nonempty string to empty string collection is returned", ()=> {
        const { result } = renderHook(() => useFuse(collection, keys, deps));
        const [ returnObj, term, setTerm] = result.current;
        
        act(()=> {
            setTerm("z");
            setTerm("");
        });
        expect(result.current[1]).toBe("");
        expect(result.current[0]).toBe(collection);
    })

    it("term is reset to empty string if deps changes", ()=> {
        const { rerender, result } = renderHook(() => useFuse(collection, keys, deps));
        const [ returnObj, term, setTerm] = result.current;
        
        act(()=>{
            setTerm("z");
        });
        
        expect(result.current[1]).toBe("z");
        deps = ["aaa"];
        rerender();
        expect(result.current[1]).toBe(""); 
    });
})