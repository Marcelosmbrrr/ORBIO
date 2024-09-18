export function exportDataAsCsv(
    name: string,
    data: { [key: string]: any }[], // ajustado para permitir objetos como valores
    options?: {
        [key: string]: { include?: boolean; is_object?: boolean; get?: string };
    }
) {
    // Verifica se há dados
    if (!data || data.length === 0) {
        return;
    }

    // Extrai as chaves (cabeçalhos) e aplica as opções
    const headers = Object.keys(data[0]).filter((header) => {
        // Se houver opções para o atributo, verifica se include é false, caso contrário, considera true
        if (options && options[header]) {
            return options[header].include !== false; // Inclui se não for explicitamente false
        }
        // Inclui por padrão se não houver opções
        return true;
    });

    // Cria uma string CSV a partir dos dados
    const csvContent = [
        headers.join(","), // Adiciona os cabeçalhos
        ...data.map((row) =>
            headers
                .map((header) => {
                    // Se o campo é um objeto, busca a propriedade especificada
                    if (
                        options &&
                        options[header]?.is_object &&
                        options[header]?.get
                    ) {
                        return `"${row[header]?.[options[header].get] ?? ""}"`;
                    }
                    // Caso contrário, retorna o valor normalmente
                    return `"${row[header]}"`;
                })
                .join(",")
        ), // Adiciona os dados, tratando para CSV
    ].join("\n"); // Junta todas as linhas em uma string

    // Cria um Blob a partir do CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Gera a data e hora atual para o nome do arquivo
    const date = new Date();
    const formattedDate = date.toLocaleDateString("pt-BR").replace(/\//g, "-");
    const formattedTime = date.toLocaleTimeString("pt-BR").replace(/:/g, "-");
    const fileName = `${name}_${formattedDate}_${formattedTime}.csv`;

    // Cria um link para baixar o arquivo
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", fileName);

    // Adiciona o link ao DOM e dispara o clique para baixar
    document.body.appendChild(link);
    link.click();

    // Limpa o link e URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
