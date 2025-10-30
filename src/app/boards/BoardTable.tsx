'use client';

import Link from 'next/link';
import { Page } from '@/types/common';

type Board = Page['content'][0];

interface BoardTableProps {
    boards: Board[];
}

export default function BoardTable({ boards }: BoardTableProps) {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 hidden md:table-header-group">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {boards.map((board) => (
                            <tr key={board.id} className="block md:table-row p-4 md:p-0 hover:bg-gray-50">
                                <td className="flex items-center md:table-cell md:px-6 md:py-4 md:whitespace-nowrap text-sm">
                                    <span className="font-bold text-gray-700 md:hidden mr-2">ID:</span>
                                    <span className="font-medium text-gray-900">{board.id}</span>
                                </td>
                                <td className="flex items-center mt-2 md:table-cell md:px-6 md:py-4 md:whitespace-nowrap text-sm text-gray-500">
                                    <span className="font-bold text-gray-700 md:hidden mr-2">카테고리:</span>
                                    {board.category}
                                </td>
                                <td className="pt-2 md:mt-0 md:table-cell md:px-6 md:py-4 text-sm text-gray-500">
                                    <span className="font-bold text-gray-700 md:hidden mr-2">제목:</span>
                                    <Link href={`/boards/${board.id}`} className="text-indigo-600 hover:text-indigo-900">
                                        {board.title}
                                    </Link>
                                </td>
                                <td className="flex items-center mt-2 md:mt-0 md:table-cell md:px-6 md:py-4 md:whitespace-nowrap text-sm text-gray-500">
                                    <span className="font-bold text-gray-700 md:hidden mr-2">작성일:</span>
                                    {new Date(board.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}