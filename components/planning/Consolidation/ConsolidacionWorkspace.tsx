import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "./consolidacion.css";
import {
  createStep6Scenario,
  deleteStep6Scenario,
  fetchStep6Portfolio,
  fetchStep6Scenarios,
  updateStep6Scenario,
} from "./api";
import {
  CATEGORY_COLORS,
  DEFAULT_CONFIG,
  FALLBACK_SCENARIO,
} from "./constants";
import {
  buildPortfolio,
  formatMetric,
  formatShort,
  normalizeApi,
  normalizeConfig,
  normalizeLocal,
  scenarioToConfig,
  toNumber,
} from "./logic";
import { scenarioSchema, type ScenarioFormValues } from "./schema";
import type {
  BlockKey,
  CategoryKey,
  Config,
  ManualSequence,
  PortfolioEntry,
  Props,
} from "./types";
import { useStep6WorkspaceStore } from "./workspaceStore";
const ConsolidacionWorkspace: React.FC<Props> = ({
  rows,
  onFinalize,
  canModify,
  trm,
  showLauncher = true,
}) => {
  const qc = useQueryClient();
  const {
    isWorkspaceOpen,
    isControlsCollapsed,
    selectedScenarioId,
    selectedProjectId,
    openWorkspace,
    closeWorkspace,
    toggleControls,
    setSelectedScenarioId,
    setSelectedProjectId,
  } = useStep6WorkspaceStore();

  const [config, setConfig] = useState<Config>({ ...DEFAULT_CONFIG });
  const [chartBaseWidth, setChartBaseWidth] = useState(900);
  const [nameDraft, setNameDraft] = useState("");
  const [descDraft, setDescDraft] = useState("");
  const [baselineDraft, setBaselineDraft] = useState(false);
  const [showNewScenario, setShowNewScenario] = useState(false);
  const [manualSequence, setManualSequence] = useState<ManualSequence | null>(
    null,
  );
  const [draggingProjectId, setDraggingProjectId] = useState<string | null>(
    null,
  );
  const [dropTarget, setDropTarget] = useState<{
    id: string;
    place: "before" | "after";
  } | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<ScenarioFormValues>({
    resolver: zodResolver(scenarioSchema),
    defaultValues: { name: "", description: "", markAsBaseline: false },
  });

  const pQuery = useQuery({
    queryKey: ["step6-portfolio"],
    queryFn: fetchStep6Portfolio,
    staleTime: 60000,
  });
  const sQuery = useQuery({
    queryKey: ["step6-scenarios"],
    queryFn: fetchStep6Scenarios,
    staleTime: 30000,
  });

  const createScenario = useMutation({
    mutationFn: createStep6Scenario,
    onSuccess: (d) => {
      qc.invalidateQueries({ queryKey: ["step6-scenarios"] });
      setSelectedScenarioId(d.id);
      setShowNewScenario(false);
      form.reset({ name: "", description: "", markAsBaseline: false });
    },
  });

  const updateScenario = useMutation({
    mutationFn: updateStep6Scenario,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["step6-scenarios"] }),
  });

  const deleteScenario = useMutation({
    mutationFn: deleteStep6Scenario,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["step6-scenarios"] });
      setSelectedScenarioId(null);
    },
  });

  const localProjects = useMemo(() => normalizeLocal(rows, trm), [rows, trm]);
  const dbProjects = useMemo(
    () => normalizeApi(Array.isArray(pQuery.data) ? pQuery.data : []),
    [pQuery.data],
  );
  const projects = useMemo(
    () => (dbProjects.length ? dbProjects : localProjects),
    [dbProjects, localProjects],
  );
  const scenarios = useMemo(
    () =>
      Array.isArray(sQuery.data) && sQuery.data.length
        ? sQuery.data
        : [FALLBACK_SCENARIO],
    [sQuery.data],
  );
  const activeScenario = useMemo(
    () => scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0],
    [scenarios, selectedScenarioId],
  );

  useEffect(() => {
    if (!scenarios.some((s) => s.id === selectedScenarioId)) {
      const b = scenarios.find((s) => s.isBaseline) || scenarios[0];
      setSelectedScenarioId(b.id);
    }
  }, [scenarios, selectedScenarioId, setSelectedScenarioId]);

  useEffect(() => {
    setConfig(scenarioToConfig(activeScenario));
    setNameDraft(activeScenario.name || "");
    setDescDraft(activeScenario.description || "");
    setBaselineDraft(Boolean(activeScenario.isBaseline));
    setSelectedProjectId(null);
  }, [activeScenario?.id, setSelectedProjectId]);

  useEffect(() => {
    if (!isWorkspaceOpen) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeWorkspace();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isWorkspaceOpen, closeWorkspace]);

  useLayoutEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const upd = () => setChartBaseWidth(Math.max(760, el.clientWidth - 8));
    upd();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(upd);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isWorkspaceOpen, isControlsCollapsed]);

  const directions = useMemo(() => {
    const m = new Map<string, { label: string; budget: number }>();
    projects.forEach((p) => {
      const x = m.get(p.direccionKey) || {
        label: p.direccionLabel || "Sin direccion",
        budget: 0,
      };
      x.budget += p.inversion;
      m.set(p.direccionKey, x);
    });
    return Array.from(m.entries())
      .map(([key, v]) => ({ key, label: v.label, budget: v.budget }))
      .sort((a, b) => a.label.localeCompare(b.label, "es"));
  }, [projects]);

  const filtered = useMemo(
    () =>
      config.direction === "all"
        ? projects
        : projects.filter((p) => p.direccionKey === config.direction),
    [projects, config.direction],
  );
  const basePortfolio = useMemo(
    () => buildPortfolio(filtered, config),
    [filtered, config],
  );

  const portfolio = useMemo(() => {
    if (!manualSequence) return basePortfolio;

    const entryMap = new Map<string, PortfolioEntry>(
      basePortfolio.ordered.map((entry) => [entry.id, entry] as const),
    );
    const baseIds = basePortfolio.ordered.map((entry) => entry.id);
    const seen = new Set<string>();
    const mergedIds: string[] = [];

    manualSequence.ids.forEach((id) => {
      if (entryMap.has(id) && !seen.has(id)) {
        mergedIds.push(id);
        seen.add(id);
      }
    });
    baseIds.forEach((id) => {
      if (!seen.has(id)) {
        mergedIds.push(id);
        seen.add(id);
      }
    });

    const blockMap: Record<string, BlockKey> = {};
    basePortfolio.ordered.forEach((entry) => {
      blockMap[entry.id] = entry.block;
    });
    Object.entries(manualSequence.blocks).forEach(([id, block]) => {
      if (entryMap.has(id)) {
        blockMap[id] = block as BlockKey;
      }
    });

    const blocks: Record<BlockKey, PortfolioEntry[]> = { 1: [], 2: [], 3: [] };
    const ordered: PortfolioEntry[] = [];
    let cumulative = 0;
    let included = 0;
    let reached = false;

    mergedIds.forEach((id) => {
      const base = entryMap.get(id);
      if (!base) return;

      const project: PortfolioEntry = {
        ...base,
        block: blockMap[id] || base.block,
        startCapex: cumulative,
        endCapex: cumulative + base.inversion,
        included: false,
      };
      cumulative += base.inversion;
      if (!reached && included + base.inversion <= config.budget) {
        project.included = true;
        included += base.inversion;
      } else {
        project.included = false;
        reached = true;
      }
      ordered.push(project);
      blocks[project.block].push(project);
    });

    return {
      ordered,
      blocks,
      blockTotals: {
        1: blocks[1].reduce((acc, item) => acc + item.inversion, 0),
        2: blocks[2].reduce((acc, item) => acc + item.inversion, 0),
        3: blocks[3].reduce((acc, item) => acc + item.inversion, 0),
      },
      totalInvestment: cumulative,
      includedInvestment: included,
    };
  }, [basePortfolio, manualSequence, config.budget]);
  const selected =
    portfolio.ordered.find((p) => p.id === selectedProjectId) || null;
  const excluded = Math.max(
    0,
    portfolio.totalInvestment - portfolio.includedInvestment,
  );

  useEffect(() => {
    if (
      selectedProjectId &&
      !portfolio.ordered.some((p) => p.id === selectedProjectId)
    ) {
      setSelectedProjectId(null);
    }
  }, [selectedProjectId, portfolio.ordered, setSelectedProjectId]);

  useEffect(() => {
    setManualSequence(null);
    setDraggingProjectId(null);
    setDropTarget(null);
  }, [activeScenario?.id]);

  const moveProjectToIndex = (projectId: string, targetIndex: number) => {
    setManualSequence((previous) => {
      const base = {
        ids: basePortfolio.ordered.map((entry) => entry.id),
        blocks: Object.fromEntries(
          basePortfolio.ordered.map((entry) => [entry.id, entry.block]),
        ) as Record<string, BlockKey>,
      };
      const current = previous || base;
      const sourceIndex = current.ids.indexOf(projectId);
      if (sourceIndex < 0) return current;

      const boundedTarget = Math.max(
        0,
        Math.min(current.ids.length - 1, targetIndex),
      );
      if (boundedTarget === sourceIndex) return current;

      const ids = [...current.ids];
      const blockByPosition = current.ids.map((id) => current.blocks[id] || 3);
      const [movedId] = ids.splice(sourceIndex, 1);
      ids.splice(boundedTarget, 0, movedId);

      // Keep block boundaries attached to positions so crossing boundaries can change block.
      const blocks = ids.reduce(
        (acc, id, index) => {
          acc[id] = blockByPosition[index] || 3;
          return acc;
        },
        {} as Record<string, BlockKey>,
      );

      return { ids, blocks };
    });
  };

  const moveProjectRelative = (
    projectId: string,
    targetId: string,
    place: "before" | "after",
  ) => {
    const sourceIndex = portfolio.ordered.findIndex((p) => p.id === projectId);
    const targetIndex = portfolio.ordered.findIndex((p) => p.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex)
      return;

    let nextIndex: number;
    if (place === "before")
      nextIndex = targetIndex > sourceIndex ? targetIndex - 1 : targetIndex;
    else nextIndex = targetIndex > sourceIndex ? targetIndex : targetIndex + 1;
    moveProjectToIndex(projectId, nextIndex);
  };

  const moveSelectedProject = (direction: "left" | "right") => {
    if (!selectedProjectId) return;
    const currentIndex = portfolio.ordered.findIndex(
      (p) => p.id === selectedProjectId,
    );
    if (currentIndex < 0) return;
    const targetIndex =
      direction === "left" ? currentIndex - 1 : currentIndex + 1;
    moveProjectToIndex(selectedProjectId, targetIndex);
  };

  const resetManualPriority = () => {
    setManualSequence(null);
  };

  const byBlock = useMemo(() => {
    const summary = { 1: { i: 0, b: 0 }, 2: { i: 0, b: 0 }, 3: { i: 0, b: 0 } };
    portfolio.ordered.forEach((p) => {
      if (p.included) summary[p.block].i += p.inversion;
      else summary[p.block].b += p.inversion;
    });
    return summary;
  }, [portfolio.ordered]);

  const chartOption = useMemo(
    () => ({
      backgroundColor: "transparent",
      grid: { left: 40, right: 16, top: 36, bottom: 28 },
      legend: {
        top: 0,
        textStyle: { color: "#6b7280", fontSize: 11 },
        data: ["Incluido", "Backlog"],
      },
      xAxis: {
        type: "category",
        data: ["Bloque 1", "Bloque 2", "Bloque 3"],
        axisLabel: { color: "#6b7280", fontSize: 11 },
        axisLine: { lineStyle: { color: "#d1d5db" } },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#6b7280", fontSize: 11 },
        splitLine: { lineStyle: { color: "rgba(209,213,219,0.6)" } },
      },
      series: [
        {
          name: "Incluido",
          type: "bar",
          stack: "t",
          data: [byBlock[1].i, byBlock[2].i, byBlock[3].i],
          itemStyle: { color: "#10b981", borderRadius: [6, 6, 0, 0] },
        },
        {
          name: "Backlog",
          type: "bar",
          stack: "t",
          data: [byBlock[1].b, byBlock[2].b, byBlock[3].b],
          itemStyle: { color: "#f59e0b", borderRadius: [6, 6, 0, 0] },
        },
      ],
    }),
    [byBlock],
  );

  const chartHeight = 300;
  const scale = chartBaseWidth / Math.max(1, config.budget);
  const trackWidth = Math.max(
    chartBaseWidth,
    portfolio.totalInvestment * scale,
  );
  const vals = portfolio.ordered.map((p) => p.metricValue || 0);
  const maxVal = Math.max(0, ...vals);
  const minVal = Math.min(0, ...vals);
  const range = maxVal - minVal || 1;
  const zeroY =
    maxVal === 0 && minVal === 0 ? chartHeight : (maxVal / range) * chartHeight;

  const changeCfg = (k: keyof Config, v: number | string) =>
    setConfig((p) => normalizeConfig({ ...p, [k]: v } as Config));

  const saveScenarioData = () => {
    if (!canModify || activeScenario.id <= 0) return;
    updateScenario.mutate({
      id: activeScenario.id,
      payload: {
        name: nameDraft,
        description: descDraft,
        isBaseline: baselineDraft ? 1 : 0,
        metric: config.metric,
        directionKey: config.direction,
        budgetMUsd: config.budget,
        maintenanceHigh: config.maintenanceHigh,
        maintenanceMed: config.maintenanceMed,
        protectionHigh: config.protectionHigh,
        protectionMed: config.protectionMed,
      },
    });
  };

  const createScenarioData = form.handleSubmit((v) =>
    createScenario.mutate({
      name: v.name,
      description: v.description || "",
      isBaseline: v.markAsBaseline ? 1 : 0,
      metric: config.metric,
      directionKey: config.direction,
      budgetMUsd: config.budget,
      maintenanceHigh: config.maintenanceHigh,
      maintenanceMed: config.maintenanceMed,
      protectionHigh: config.protectionHigh,
      protectionMed: config.protectionMed,
      createdBy: "local-user",
    }),
  );

  if (pQuery.isLoading && !localProjects.length) {
    return (
      <div className="p-10 rounded-[2.5rem] border bg-white border-gray-100 shadow-sm">
        <p className="text-sm font-bold">
          Cargando portafolio validado desde MySQL local...
        </p>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="p-10 rounded-[2.5rem] border bg-white border-gray-100 shadow-sm">
        <p className="text-sm font-bold">No hay proyectos para consolidar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showLauncher && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm text-gray-900">
          <p className="text-[10px] font-black uppercase tracking-wider">
            Presupuesto disponible
          </p>
          <p className="text-3xl font-black mt-2">
            {formatShort(config.budget)}
          </p>
          <p className="text-xs font-semibold text-gray-400 mt-1">
            techo de inversion
          </p>
        </div>
        <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 shadow-sm text-emerald-700">
          <p className="text-[10px] font-black uppercase tracking-wider">
            Inversion aprobada
          </p>
          <p className="text-3xl font-black mt-2">
            {formatShort(portfolio.includedInvestment)}
          </p>
          <p className="text-xs font-semibold opacity-90 mt-1">
            {portfolio.ordered.filter((p) => p.included).length} proyectos
          </p>
        </div>
        <div className="bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100 shadow-sm text-blue-700">
          <p className="text-[10px] font-black uppercase tracking-wider">
            Remanente / deficit
          </p>
          <p className="text-3xl font-black mt-2">
            {formatShort(config.budget - portfolio.includedInvestment)}
          </p>
          <p className="text-xs font-semibold opacity-90 mt-1">
            diferencia de fondos
          </p>
        </div>
        <div className="bg-amber-50 p-6 rounded-[2.5rem] border border-amber-100 shadow-sm text-amber-700">
          <p className="text-[10px] font-black uppercase tracking-wider">
            Backlog
          </p>
          <p className="text-3xl font-black mt-2">{formatShort(excluded)}</p>
          <p className="text-xs font-semibold opacity-90 mt-1">
            {portfolio.ordered.filter((p) => !p.included).length} proyectos
          </p>
        </div>
      </div>

      <div className="rounded-[3rem] border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-2xl font-black tracking-tighter text-gray-900">
              Paso 4 - Resumen & Consolidacion
            </h4>
            <p className="text-xs font-semibold text-gray-500 mt-1">
              Herramienta avanzada en modal fullscreen para maximizar espacio
              útil.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-lg bg-gray-50 text-gray-700 text-[10px] font-black uppercase tracking-wider border border-gray-100">
              Fuente:{" "}
              {dbProjects.length
                ? "MySQL local / planning_step6_portfolio"
                : "Sesion actual"}
            </span>
            {pQuery.isError && (
              <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-[10px] font-black border border-amber-200">
                Fallback local activo
              </span>
            )}
            <button
              type="button"
              onClick={openWorkspace}
              className="px-4 py-2 rounded-xl bg-[#EF3340] text-white text-xs font-black uppercase tracking-wider hover:bg-[#d62e39]"
            >
              Abrir Fullscreen
            </button>
            <button
              type="button"
              onClick={onFinalize}
              disabled={!canModify || portfolio.includedInvestment <= 0}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${
                canModify && portfolio.includedInvestment > 0
                  ? "bg-[#0b0e14] text-white hover:bg-[#EF3340]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Confirmar consolidacion
            </button>
          </div>
        </div>
      </div>

        </>
      )}

      <AnimatePresence>
        {isWorkspaceOpen && (
          <motion.div
            className="fixed inset-0 z-[140] bg-black/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="h-full w-full flex flex-col bg-[#F8F9FB]"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
            >
              <header className="px-6 py-4 border-b border-gray-100 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-gray-900 text-lg font-black">
                      Laboratorio de Consolidacion CAPEX
                    </h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Escenarios + ajustes de presupuesto + priorizacion.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleControls}
                      className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      {isControlsCollapsed ? (
                        <PanelLeftOpen size={16} />
                      ) : (
                        <PanelLeftClose size={16} />
                      )}
                    </button>
                    <select
                      value={activeScenario.id}
                      onChange={(e) =>
                        setSelectedScenarioId(toNumber(e.target.value, 0))
                      }
                      className="h-9 px-3 rounded-lg bg-white border border-gray-200 text-gray-900 text-xs font-bold min-w-[220px]"
                    >
                      {scenarios.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                          {s.isBaseline ? " (Base)" : ""}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        form.reset({
                          name: `Escenario ${scenarios.length + 1}`,
                          description: "",
                          markAsBaseline: false,
                        });
                        setShowNewScenario(true);
                      }}
                      className="h-9 px-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 text-xs font-black uppercase tracking-wider"
                    >
                      <span className="inline-flex items-center gap-1">
                        <Plus size={13} />
                        Nuevo
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={saveScenarioData}
                      disabled={
                        !canModify ||
                        activeScenario.id <= 0 ||
                        updateScenario.isPending
                      }
                      className={`h-9 px-3 rounded-lg text-xs font-black uppercase tracking-wider ${canModify && activeScenario.id > 0 ? "bg-[#EF3340] text-white" : "bg-gray-200 text-gray-400"}`}
                    >
                      <span className="inline-flex items-center gap-1">
                        <Save size={13} />
                        Guardar
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteScenario.mutate(activeScenario.id)}
                      disabled={
                        !canModify ||
                        activeScenario.id <= 0 ||
                        activeScenario.isBaseline ||
                        deleteScenario.isPending
                      }
                      className={`h-9 px-3 rounded-lg text-xs font-black uppercase tracking-wider ${
                        canModify &&
                        activeScenario.id > 0 &&
                        !activeScenario.isBaseline
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <span className="inline-flex items-center gap-1">
                        <Trash2 size={13} />
                        Eliminar
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={closeWorkspace}
                      className="h-9 w-9 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </header>

              <div className="flex-1 min-h-0 flex overflow-hidden">
                <aside
                  className={`transition-all duration-300 border-r border-gray-100 bg-[#1f2937] ${isControlsCollapsed ? "w-14" : "w-[330px]"}`}
                >
                  {!isControlsCollapsed && (
                    <div className="h-full overflow-y-auto p-4 space-y-4">
                      <div className="rounded-xl border border-gray-200 bg-white p-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                          Escenario
                        </p>
                        <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                          Nombre
                        </label>
                        <input
                          value={nameDraft}
                          onChange={(e) => setNameDraft(e.target.value)}
                          disabled={!canModify}
                          className="w-full h-9 px-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm"
                        />
                        <label className="text-[11px] font-semibold text-gray-700 block mb-1 mt-3">
                          Descripcion
                        </label>
                        <textarea
                          value={descDraft}
                          onChange={(e) => setDescDraft(e.target.value)}
                          disabled={!canModify}
                          className="w-full min-h-[70px] p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm resize-none"
                        />
                        <label className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-gray-700">
                          <input
                            type="checkbox"
                            checked={baselineDraft}
                            onChange={(e) => setBaselineDraft(e.target.checked)}
                            disabled={!canModify}
                          />
                          Baseline
                        </label>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-white p-3 space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          Ajustes CAPEX
                        </p>
                        <label className="text-[11px] font-semibold text-gray-700 block">
                          Direccion
                          <select
                            value={config.direction}
                            onChange={(e) =>
                              changeCfg("direction", e.target.value)
                            }
                            disabled={!canModify}
                            className="mt-1 w-full h-9 px-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm"
                          >
                            <option value="all">Todas</option>
                            {directions.map((d) => (
                              <option key={d.key} value={d.key}>
                                {d.label} - {formatShort(d.budget)}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="text-[11px] font-semibold text-gray-700 block">
                          Metrica
                          <select
                            value={config.metric}
                            onChange={(e) =>
                              changeCfg(
                                "metric",
                                e.target.value === "vpn" ? "vpn" : "vpn_i",
                              )
                            }
                            disabled={!canModify}
                            className="mt-1 w-full h-9 px-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm"
                          >
                            <option value="vpn_i">VPN/I</option>
                            <option value="vpn">VPN</option>
                          </select>
                        </label>
                        <label className="text-[11px] font-semibold text-gray-700 block">
                          Presupuesto (M USD)
                          <input
                            type="number"
                            min={1}
                            step={1}
                            value={Math.round(config.budget)}
                            onChange={(e) =>
                              changeCfg(
                                "budget",
                                toNumber(e.target.value, config.budget),
                              )
                            }
                            disabled={!canModify}
                            className="mt-1 w-full h-9 px-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm"
                          />
                        </label>
                      </div>

                      <div className="consolidacion-risk-card space-y-5">
                        <h6 className="text-[18px] font-black leading-none text-[#111827]">
                          Mantenimiento
                        </h6>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-semibold text-[#111827]">
                              Riesgo alto
                            </span>
                            <span className="text-[12px] font-medium text-[#6B7280]">
                              &gt;= {Math.round(config.maintenanceHigh)}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={30}
                            value={config.maintenanceHigh}
                            onChange={(e) =>
                              changeCfg(
                                "maintenanceHigh",
                                toNumber(
                                  e.target.value,
                                  config.maintenanceHigh,
                                ),
                              )
                            }
                            disabled={!canModify}
                            className="consolidacion-range disabled:opacity-60"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-semibold text-[#111827]">
                              Riesgo medio
                            </span>
                            <span className="text-[12px] font-medium text-[#6B7280] text-right">
                              desde {Math.round(config.maintenanceMed)} hasta
                              &lt; {Math.round(config.maintenanceHigh)}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={30}
                            value={config.maintenanceMed}
                            onChange={(e) =>
                              changeCfg(
                                "maintenanceMed",
                                toNumber(e.target.value, config.maintenanceMed),
                              )
                            }
                            disabled={!canModify}
                            className="consolidacion-range disabled:opacity-60"
                          />
                        </div>
                      </div>

                      <div className="consolidacion-risk-card space-y-5">
                        <h6 className="text-[18px] font-black leading-none text-[#111827]">
                          Proteccion EBITDA
                        </h6>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-semibold text-[#111827]">
                              Riesgo alto
                            </span>
                            <span className="text-[12px] font-medium text-[#6B7280]">
                              &gt;= {Math.round(config.protectionHigh)}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={30}
                            value={config.protectionHigh}
                            onChange={(e) =>
                              changeCfg(
                                "protectionHigh",
                                toNumber(e.target.value, config.protectionHigh),
                              )
                            }
                            disabled={!canModify}
                            className="consolidacion-range disabled:opacity-60"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-semibold text-[#111827]">
                              Riesgo medio
                            </span>
                            <span className="text-[12px] font-medium text-[#6B7280] text-right">
                              desde {Math.round(config.protectionMed)} hasta
                              &lt; {Math.round(config.protectionHigh)}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={30}
                            value={config.protectionMed}
                            onChange={(e) =>
                              changeCfg(
                                "protectionMed",
                                toNumber(e.target.value, config.protectionMed),
                              )
                            }
                            disabled={!canModify}
                            className="consolidacion-range disabled:opacity-60"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </aside>

                <main className="flex-1 min-h-0 overflow-auto p-5 bg-[#F8F9FB]">
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                    <section className="xl:col-span-8 rounded-[2rem] border border-gray-100 bg-white p-6 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <BarChart3 size={16} className="text-gray-700" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">
                          Portafolio priorizado
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="rounded-xl border px-3 py-2 bg-gray-50 border-gray-100">
                          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                            Presupuesto
                          </p>
                          <p className="text-sm font-black text-gray-900">
                            {formatShort(config.budget)}
                          </p>
                        </div>
                        <div className="rounded-xl border px-3 py-2 bg-gray-50 border-gray-100">
                          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                            Priorizado
                          </p>
                          <p className="text-sm font-black text-gray-900">
                            {formatShort(portfolio.includedInvestment)}
                          </p>
                        </div>
                        <div className="rounded-xl border px-3 py-2 bg-gray-50 border-gray-100">
                          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                            Backlog
                          </p>
                          <p className="text-sm font-black text-gray-900">
                            {formatShort(excluded)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs font-bold">
                        {(Object.keys(CATEGORY_COLORS) as CategoryKey[]).map(
                          (k) => (
                            <div key={k} className="flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded"
                                style={{ background: CATEGORY_COLORS[k] }}
                              />
                              <span className="text-gray-500">{k}</span>
                            </div>
                          ),
                        )}
                      </div>
                      <div className="consolidacion-priority-panel">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                              Prioridad manual
                            </p>
                            <p className="text-[11px] font-semibold text-gray-500">
                              Arrastra una columna o usa flechas con el proyecto
                              seleccionado.
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="hidden lg:block max-w-[240px] truncate text-[11px] font-semibold text-gray-600">
                              {selected
                                ? selected.nombre
                                : "Selecciona un proyecto"}
                            </span>
                            <button
                              type="button"
                              onClick={() => moveSelectedProject("left")}
                              disabled={!canModify || !selected}
                              className={`h-8 w-8 rounded-lg border flex items-center justify-center ${
                                canModify && selected
                                  ? "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                  : "bg-gray-100 border-gray-200 text-gray-400"
                              }`}
                              title="Mover a la izquierda"
                            >
                              <ChevronLeft size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveSelectedProject("right")}
                              disabled={!canModify || !selected}
                              className={`h-8 w-8 rounded-lg border flex items-center justify-center ${
                                canModify && selected
                                  ? "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                  : "bg-gray-100 border-gray-200 text-gray-400"
                              }`}
                              title="Mover a la derecha"
                            >
                              <ChevronRight size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={resetManualPriority}
                              disabled={!canModify || !manualSequence}
                              className={`h-8 px-2 rounded-lg border text-[10px] font-black uppercase tracking-wider ${
                                canModify && manualSequence
                                  ? "bg-red-50 border-red-100 text-[#EF3340] hover:bg-red-100"
                                  : "bg-gray-100 border-gray-200 text-gray-400"
                              }`}
                            >
                              <span className="inline-flex items-center gap-1">
                                <RotateCcw size={12} />
                                Reset
                              </span>
                            </button>
                          </div>
                        </div>
                        <div ref={chartRef} className="overflow-x-auto">
                          <div
                            className="relative rounded-lg bg-white/85"
                            style={{
                              width: `${trackWidth}px`,
                              height: `${chartHeight}px`,
                            }}
                          >
                            <div
                              className="absolute left-0 right-0 border-t border-dashed border-gray-400 z-20"
                              style={{ top: `${zeroY}px` }}
                            />
                            <div
                              className="absolute top-0 bottom-0 border-l-2 border-dashed border-gray-700 z-30"
                              style={{ left: `${config.budget * scale}px` }}
                            />
                            {portfolio.ordered.map((p) => {
                              const left = p.startCapex * scale;
                              const width = Math.max(4, p.inversion * scale);
                              const h =
                                p.metricValue === 0
                                  ? 2
                                  : Math.max(
                                      2,
                                      (Math.abs(p.metricValue) / range) *
                                        chartHeight,
                                    );
                              const top =
                                p.metricValue >= 0 ? zeroY - h : zeroY;
                              const isDragging = draggingProjectId === p.id;
                              const dropBefore =
                                dropTarget?.id === p.id &&
                                dropTarget.place === "before";
                              const dropAfter =
                                dropTarget?.id === p.id &&
                                dropTarget.place === "after";

                              return (
                                <button
                                  key={p.id}
                                  type="button"
                                  draggable={canModify}
                                  onClick={() => setSelectedProjectId(p.id)}
                                  onDragStart={(e) => {
                                    if (!canModify) return;
                                    setDraggingProjectId(p.id);
                                    setSelectedProjectId(p.id);
                                    setDropTarget(null);
                                    e.dataTransfer.effectAllowed = "move";
                                    e.dataTransfer.setData("text/plain", p.id);
                                  }}
                                  onDragOver={(e) => {
                                    if (
                                      !canModify ||
                                      !draggingProjectId ||
                                      draggingProjectId === p.id
                                    )
                                      return;
                                    e.preventDefault();
                                    const rect =
                                      e.currentTarget.getBoundingClientRect();
                                    const place: "before" | "after" =
                                      e.clientX - rect.left < rect.width / 2
                                        ? "before"
                                        : "after";
                                    setDropTarget({ id: p.id, place });
                                    e.dataTransfer.dropEffect = "move";
                                  }}
                                  onDrop={(e) => {
                                    if (!canModify) return;
                                    e.preventDefault();
                                    const sourceId =
                                      draggingProjectId ||
                                      e.dataTransfer.getData("text/plain");
                                    const place =
                                      dropTarget?.id === p.id
                                        ? dropTarget.place
                                        : "before";
                                    if (sourceId && sourceId !== p.id) {
                                      moveProjectRelative(
                                        sourceId,
                                        p.id,
                                        place,
                                      );
                                      setSelectedProjectId(sourceId);
                                    }
                                    setDraggingProjectId(null);
                                    setDropTarget(null);
                                  }}
                                  onDragEnd={() => {
                                    setDraggingProjectId(null);
                                    setDropTarget(null);
                                  }}
                                  className="absolute rounded-md border border-black/10 shadow-sm transition-all z-20"
                                  style={{
                                    left: `${left}px`,
                                    width: `${width}px`,
                                    top: `${top}px`,
                                    height: `${h}px`,
                                    background: CATEGORY_COLORS[p.categoriaKey],
                                    opacity: isDragging
                                      ? 0.6
                                      : p.included
                                        ? 1
                                        : 0.45,
                                    outline:
                                      selectedProjectId === p.id
                                        ? "2px solid rgba(59,130,246,0.7)"
                                        : "none",
                                    boxShadow: dropBefore
                                      ? "inset 3px 0 0 0 rgba(20,121,201,0.95)"
                                      : dropAfter
                                        ? "inset -3px 0 0 0 rgba(20,121,201,0.95)"
                                        : undefined,
                                    cursor: canModify
                                      ? isDragging
                                        ? "grabbing"
                                        : "grab"
                                      : "pointer",
                                    backgroundImage: p.included
                                      ? "none"
                                      : "repeating-linear-gradient(45deg, rgba(255,255,255,0.45) 0px, rgba(255,255,255,0.45) 6px, transparent 6px, transparent 12px)",
                                  }}
                                  title={`${p.nombre} | ${formatMetric(p.metricValue, config.metric)}`}
                                />
                              );
                            })}
                          </div>
                        </div>
                        <div className="text-gray-400 text-xs font-semibold mt-2">
                          Capex acumulado (M USD)
                        </div>
                      </div>
                    </section>

                    <section className="xl:col-span-4 rounded-[2rem] border border-gray-100 bg-white p-6 space-y-4 shadow-sm">
                      <div className="rounded-xl border border-gray-200 bg-[#F8F9FB] p-4">
                        <h5 className="text-sm font-black text-gray-900 mb-2">
                          Detalle del proyecto
                        </h5>
                        {!selected ? (
                          <p className="text-gray-400 text-sm">
                            Selecciona un proyecto en la grafica.
                          </p>
                        ) : (
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-700">
                              <span className="text-gray-400">Proyecto:</span>{" "}
                              {selected.nombre}
                            </p>
                            <p className="text-gray-700">
                              <span className="text-gray-400">Categoria:</span>{" "}
                              {selected.categoriaLabel}
                            </p>
                            <p className="text-gray-700">
                              <span className="text-gray-400">Inversion:</span>{" "}
                              {formatShort(selected.inversion)}
                            </p>
                            <p className="text-gray-700">
                              <span className="text-gray-400">Metrica:</span>{" "}
                              {formatMetric(
                                selected.metricValue,
                                config.metric,
                              )}
                            </p>
                            <p className="text-gray-700">
                              <span className="text-gray-400">Riesgo:</span>{" "}
                              {selected.riesgo || selected.nivelRiesgo || "-"}
                            </p>
                            <p className="text-gray-700">
                              <span className="text-gray-400">Direccion:</span>{" "}
                              {selected.direccionLabel}
                            </p>
                            <p className="pt-2 mt-2 border-t border-gray-200 text-[11px] font-semibold text-gray-500">
                              Reordena desde la grafica usando drag and drop o
                              las flechas de prioridad.
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="rounded-xl border border-gray-200 bg-[#F8F9FB] p-3">
                        <h5 className="text-xs font-black uppercase tracking-widest text-gray-700 mb-2">
                          Cobertura por bloque
                        </h5>
                        <ReactECharts
                          option={chartOption}
                          style={{ height: 230 }}
                          notMerge
                          lazyUpdate
                        />
                      </div>
                      <button
                        type="button"
                        onClick={onFinalize}
                        disabled={
                          !canModify || portfolio.includedInvestment <= 0
                        }
                        className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest ${canModify && portfolio.includedInvestment > 0 ? "bg-[#EF3340] text-white" : "bg-gray-200 text-gray-400"}`}
                      >
                        Confirmar consolidacion
                      </button>
                    </section>
                  </div>
                </main>
              </div>
            </motion.div>

            <AnimatePresence>
              {showNewScenario && (
                <motion.div
                  className="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.form
                    onSubmit={createScenarioData}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="w-full max-w-md rounded-[2rem] border border-gray-100 bg-white p-6 space-y-4 shadow-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">
                        Nuevo escenario
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowNewScenario(false)}
                        className="h-8 w-8 rounded-lg bg-gray-50 border border-gray-200 text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <label className="block text-xs font-semibold text-gray-700">
                      Nombre
                      <input
                        {...form.register("name")}
                        className="mt-1 w-full h-9 px-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm"
                      />
                      {form.formState.errors.name && (
                        <span className="text-[11px] text-amber-700 mt-1 block">
                          {form.formState.errors.name.message}
                        </span>
                      )}
                    </label>
                    <label className="block text-xs font-semibold text-gray-700">
                      Descripcion
                      <textarea
                        {...form.register("description")}
                        className="mt-1 w-full min-h-[80px] p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm resize-none"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        {...form.register("markAsBaseline")}
                      />
                      Definir como baseline
                    </label>
                    {createScenario.isError && (
                      <p className="text-[11px] text-amber-700">
                        No se pudo crear. Verifica nombre único o backend.
                      </p>
                    )}
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowNewScenario(false)}
                        className="h-9 px-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-xs font-black uppercase tracking-wider"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={!canModify || createScenario.isPending}
                        className={`h-9 px-3 rounded-lg text-xs font-black uppercase tracking-wider ${canModify ? "bg-[#EF3340] text-white" : "bg-gray-200 text-gray-400"}`}
                      >
                        Crear
                      </button>
                    </div>
                  </motion.form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConsolidacionWorkspace;
